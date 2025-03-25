#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import json
from urllib.parse import urljoin
import sys
import re # Import regular expressions

# URL of the Oh My Zsh themes wiki page
URL = "https://github.com/ohmyzsh/ohmyzsh/wiki/Themes"
# Base URL for resolving relative links
BASE_URL = "https://github.com"
# Output JSON filename
OUTPUT_FILENAME = "ohmyzsh_themes.json"

def scrape_omz_themes(url):
    """
    Scrapes the Oh My Zsh themes wiki page.
    Version 4: Adjusted name/source extraction based on debug output.
    Looks for the first <a> tag with '.zsh-theme' in href for name/source.
    """
    print(f"Attempting to fetch themes from: {url}")
    themes_data = []
    processed_names = set()

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, timeout=20, headers=headers)
        response.raise_for_status()
        print("Successfully fetched page content.")
        # with open("omz_themes_page.html", "w", encoding="utf-8") as f:
        #     f.write(response.text)
        # print("Saved page HTML to omz_themes_page.html for inspection.")
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL {url}: {e}", file=sys.stderr)
        return None

    try:
        soup = BeautifulSoup(response.content, 'html.parser')
        wiki_body = soup.find('div', id='wiki-body')
        if not wiki_body:
            print("Error: Could not find the main wiki content area ('div#wiki-body').", file=sys.stderr)
            return None

        print("Parsing wiki content...")
        # Select paragraphs directly within the wiki body. Avoid nested paragraphs if any.
        # Using CSS selector for potentially better targeting
        potential_theme_paragraphs = wiki_body.select('div#wiki-body > p')
        # Fallback if selector doesn't work
        if not potential_theme_paragraphs:
             print("Warning: CSS selector 'div#wiki-body > p' found nothing, falling back to find_all('p').")
             potential_theme_paragraphs = wiki_body.find_all('p')

        print(f"Found {len(potential_theme_paragraphs)} potential theme containers (<p>).")

        processed_count = 0
        for i, p_tag in enumerate(potential_theme_paragraphs):
            # print(f"\n--- Processing Paragraph #{i+1} ---") # Keep commented unless debugging needed again
            theme_name = None
            image_url = None
            source_url = None

            # --- Revised Name and Source URL Extraction ---
            # Find the *first* 'a' tag that links to a theme file.
            first_theme_link = p_tag.find('a', href=lambda href: href and '.zsh-theme' in href)

            if first_theme_link:
                link_href = first_theme_link.get('href', '')
                source_url = urljoin(BASE_URL, link_href)
                # The name is likely the text content of this link
                theme_name = first_theme_link.get_text(strip=True)
                # Clean up potential junk sometimes included in link text (like trailing chars)
                theme_name = re.sub(r'\s*\(.*\)\s*$', '', theme_name).strip() # Remove trailing (...)
                # print(f"  DEBUG: Found theme link: href='{link_href}', text='{theme_name}'") # Keep commented
            # else:
                # print("  DEBUG: No <a> tag with '.zsh-theme' href found in this paragraph.") # Keep commented


            # --- Image URL Extraction (Keep as before) ---
            img_tag = p_tag.find('img')
            if img_tag:
                image_src = img_tag.get('src')
                data_src = img_tag.get('data-src')
                chosen_src = image_src
                if not chosen_src and data_src:
                    chosen_src = data_src
                # Handle private/camo URLs (they usually start with http)
                if chosen_src and chosen_src.startswith('http'):
                     image_url = chosen_src
                elif chosen_src: # If relative (less likely)
                     image_url = urljoin(BASE_URL, chosen_src)
                # if image_url:
                #      print(f"  DEBUG: Found Image URL: '{image_url}'") # Keep commented
                # else:
                #      print(f"  DEBUG: No usable image src found (src='{image_src}', data-src='{data_src}')") # Keep commented
            # else:
                 # print("  DEBUG: No <img> tag found in this paragraph.") # Keep commented


            # --- Add to results check ---
            # print(f"  DEBUG: Check for adding: Name='{theme_name}', Image='{image_url is not None}', Unique='{theme_name not in processed_names if theme_name else 'N/A'}'") # Keep commented
            if theme_name and image_url and theme_name not in processed_names:
                # Basic sanity check: avoid adding if name is empty or clearly not a theme name
                if len(theme_name) > 1 and not theme_name.startswith('<'):
                    themes_data.append({
                        "name": theme_name,
                        "preview_image_url": image_url,
                        "source_file_url": source_url
                    })
                    processed_names.add(theme_name)
                    processed_count += 1
                    # print(f"  DEBUG: *** Successfully processed and added theme: {theme_name} ***") # Keep commented
                # else:
                    # print(f"  DEBUG: Skipped adding theme '{theme_name}' due to suspicious name format.") # Keep commented
            # else:
                # if theme_name and image_url and theme_name in processed_names:
                #      print(f"  DEBUG: Skipped adding theme '{theme_name}' because it's a duplicate.") # Keep commented
                # elif not theme_name:
                #      print("  DEBUG: Skipped adding theme because name was not found.") # Keep commented
                # elif not image_url:
                #       print(f"  DEBUG: Skipped adding theme '{theme_name}' because image URL was not found.") # Keep commented


        print(f"\n-----------------------------")
        print(f"Successfully processed {processed_count} unique themes.")
        if processed_count == 0 and len(potential_theme_paragraphs) > 0:
             print("Warning: Found potential containers (<p>) but failed to extract theme data. The page structure might have changed again or the parsing logic is still flawed.", file=sys.stderr)

    except Exception as e:
        print(f"An error occurred during HTML parsing: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return None

    return themes_data

# --- Main Execution ---
if __name__ == "__main__":
    scraped_data = scrape_omz_themes(URL)

    if scraped_data is not None:
        if not scraped_data:
             print("\nWarning: Scraping finished, but no theme data was extracted.", file=sys.stderr)
        try:
            with open(OUTPUT_FILENAME, 'w', encoding='utf-8') as f:
                json.dump(scraped_data, f, indent=4, ensure_ascii=False)
            print(f"\nSuccess! Data saved to '{OUTPUT_FILENAME}'")
            if scraped_data:
                 print("\nSample data (first 5 themes):") # Increased sample size
                 print(json.dumps(scraped_data[:5], indent=4, ensure_ascii=False))
        except IOError as e:
            print(f"Error writing file '{OUTPUT_FILENAME}': {e}", file=sys.stderr)
        except Exception as e:
             print(f"An unexpected error occurred during file writing: {e}", file=sys.stderr)
    else:
        print("\nScraping failed. No output file generated.", file=sys.stderr)
        sys.exit(1)