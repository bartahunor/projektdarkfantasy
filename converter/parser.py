import json
import re

def parse_adventure_text(text):
    """
    Kalandkönyv szöveg parser - JSON formátumba alakít
    """
    entries = []
    
    # Szétválasztjuk a bejegyzéseket a #-ok alapján
    sections = re.split(r'(?=^#\d+)', text, flags=re.MULTILINE)
    sections = [s.strip() for s in sections if s.strip()]
    
    for section in sections:
        lines = section.split('\n')
        
        # ID kinyerése (#6 formátum)
        id_match = re.match(r'^#(\d+)', lines[0])
        if not id_match:
            continue
        
        entry_id = int(id_match.group(1))
        
        # Szöveg összeállítása
        text_lines = []
        i = 1
        
        while i < len(lines):
            line = lines[i].strip()
            
            # Ha üres sor vagy választás kezdődik, megállunk a fő szövegnél
            if not line:
                i += 1
                continue
            
            # Ha ellenség statisztika vagy választás, megállunk
            if re.match(r'^(ÜGYESSÉG|ÉLETERŐ|Ha .+lapozz|Lapozz)', line, re.IGNORECASE):
                break
                
            text_lines.append(line)
            i += 1
        
        main_text = ' '.join(text_lines).strip()
        
        # Teljes szöveg a keresésekhez
        full_text = '\n'.join(lines)
        
        # Választások keresése
        choices = []
        
        # "Ha ... lapozz" típusú választások
        conditional_pattern = r'Ha (.+?), lapozz (?:a|az) (\d+)-r[ea]'
        for match in re.finditer(conditional_pattern, full_text, re.IGNORECASE):
            choice_text = match.group(1).strip()
            target = int(match.group(2))
            
            # Feltétel keresése (pl. "van nálad")
            condition = None
            if 'van nálad' in choice_text.lower():
                item_match = re.search(r'van nálad (?:egy )?([A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+)', choice_text, re.IGNORECASE)
                if item_match:
                    item_name = item_match.group(1).lower()
                    condition = f"has_item:{item_name}"
            
            choice = {
                "text": choice_text,
                "target": target
            }
            
            if condition:
                choice["condition"] = condition
            
            choices.append(choice)
        
        # Ha nincs feltételes, keressünk egyszerű "Lapozz" utasításokat
        if not choices:
            simple_pattern = r'Lapozz (?:a|az) (\d+)-r[ea]'
            for match in re.finditer(simple_pattern, full_text, re.IGNORECASE):
                target = int(match.group(1))
                choices.append({
                    "text": f"Lapozz a {target}-re",
                    "target": target
                })
        
        # Ellenség keresése
        enemy = None
        enemy_pattern = r'([^\n]+?)\s*\n\s*ÜGYESSÉG\s+(\d+)\s*\n\s*ÉLETERŐ\s+(\d+)'
        enemy_match = re.search(enemy_pattern, full_text, re.MULTILINE | re.IGNORECASE)
        
        if enemy_match:
            enemy_name = enemy_match.group(1).strip()
            # Tisztítás (ha van felesleges szöveg előtte)
            enemy_name = re.sub(r'^.*?(Harcolnod kell!?\s*)', '', enemy_name, flags=re.IGNORECASE)
            enemy_name = enemy_name.strip()
            
            enemy = {
                "name": enemy_name,
                "skill": int(enemy_match.group(2)),
                "stamina": int(enemy_match.group(3))
            }
        
        # Harc megállapítása
        action = "combat" if enemy else None
        
        # Vége?
        end = "kalandod itt véget ér" in full_text.lower() and not choices
        
        # Tárgyak keresése
        items = []
        item_patterns = [
            r'Arany[Kk]ulcs',
            r'Bronz [Kk]ulcs',
            r'kötél',
            r'köpeny',
            r'gyűrű',
            r'fiola',
            r'üveg'
        ]
        
        for pattern in item_patterns:
            if re.search(pattern, full_text, re.IGNORECASE):
                item_name = re.search(pattern, full_text, re.IGNORECASE).group(0).lower()
                if item_name not in items:
                    items.append(item_name)
        
        # Entry összeállítása
        entry = {
            "id": entry_id,
            "text": main_text,
            "choices": choices if choices else None,
            "enemy": enemy,
            "action": action,
            "items": items,
            "end": end
        }
        
        entries.append(entry)
    
    return entries


def main():
    """
    Főprogram - beolvassa a szöveget és létrehozza a JSON-t
    """
    
    # Beolvasás fájlból - automatikus fájlkeresés
    import os
    import glob
    
    # Keress .txt fájlokat
    txt_files = glob.glob('*.txt')
    
    if not txt_files:
        print("❌ Nem található .txt fájl a mappában!")
        print("Hozz létre egy .txt fájlt a kalandkönyv szövegével.")
        return
    
    # Ha több fájl van, kérdezd meg
    if len(txt_files) > 1:
        print("📁 Több .txt fájl található:")
        for i, f in enumerate(txt_files, 1):
            print(f"  {i}. {f}")
        choice = input("Melyiket dolgozzam fel? (szám): ")
        try:
            input_file = txt_files[int(choice) - 1]
        except:
            input_file = txt_files[0]
    else:
        input_file = txt_files[0]
    
    output_file = 'infok_generated.json'
    
    print(f"📖 Feldolgozom: {input_file}")
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            text = f.read()
        
        print(f"📖 Szöveg beolvasva: {len(text)} karakter")
        
        # Feldolgozás
        entries = parse_adventure_text(text)
        
        print(f"✅ {len(entries)} bejegyzés feldolgozva")
        
        # JSON kiírása
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(entries, f, ensure_ascii=False, indent=2)
        
        print(f"💾 JSON mentve: {output_file}")
        
        # Statisztika
        enemy_count = sum(1 for e in entries if e['enemy'])
        end_count = sum(1 for e in entries if e['end'])
        
        print(f"\n📊 Statisztika:")
        print(f"   - Összes bejegyzés: {len(entries)}")
        print(f"   - Harcok: {enemy_count}")
        print(f"   - Végpontok: {end_count}")
        
    except FileNotFoundError:
        print(f"❌ Hiba: {input_file} nem található!")
        print(f"Hozz létre egy {input_file} fájlt a szöveggel.")
    except Exception as e:
        print(f"❌ Hiba történt: {e}")


if __name__ == "__main__":
    main()