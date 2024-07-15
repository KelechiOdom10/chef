import prompts from "prompts";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";

interface ThemeOptions {
  light: string;
  dark: string;
}

interface ISVG {
  id: number;
  title: string;
  category: string | string[];
  route: string | ThemeOptions;
  wordmark?: string | ThemeOptions;
  url: string;
}

const DATA_FILE = join(process.cwd(), "src", "content", "svgs.json");

// ANSI color codes
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

async function fetchSVG(searchTerm: string): Promise<ISVG[]> {
  console.log(`${CYAN}Fetching SVGs for "${searchTerm}"...${RESET}`);
  try {
    const response = await fetch(
      `https://svgl.app/api/svgs?search=${searchTerm}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`${YELLOW}Error fetching SVG:${RESET}`, error);
    return [];
  }
}

function loadExistingSVGs(): ISVG[] {
  if (existsSync(DATA_FILE)) {
    const data = readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  }
  return [];
}

function saveSVGs(svgs: ISVG[]) {
  const dir = dirname(DATA_FILE);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(DATA_FILE, JSON.stringify(svgs, null, 2));
}

function addNewSVGs(existingSVGs: ISVG[], newSVGs: ISVG[]): ISVG[] {
  const updatedSVGs = [...existingSVGs];
  let addedCount = 0;
  for (const newSVG of newSVGs) {
    if (!updatedSVGs.some(svg => svg.id === newSVG.id)) {
      updatedSVGs.push(newSVG);
      addedCount++;
    }
  }
  console.log(`${GREEN}Added ${addedCount} new SVGs.${RESET}`);
  return updatedSVGs;
}

export async function main() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const action = await prompts({
      type: "select",
      name: "value",
      message: "What would you like to do?",
      choices: [
        { title: "Search for SVGs", value: "search" },
        { title: "View stored SVGs", value: "view" },
        { title: "Exit", value: "exit" },
      ],
    });

    if (action.value === "exit") {
      console.log(`${CYAN}Goodbye!${RESET}`);
      break;
    }

    if (action.value === "search") {
      const response = await prompts({
        type: "text",
        name: "searchTerm",
        message: "Enter the SVG name you want to search for:",
      });

      console.log(`${CYAN}Searching for "${response.searchTerm}"...${RESET}`);

      const newSVGs = await fetchSVG(response.searchTerm);
      if (newSVGs.length === 0) {
        console.log(
          `${YELLOW}No SVGs found for "${response.searchTerm}".${RESET}`
        );
        continue;
      }

      const existingSVGs = loadExistingSVGs();
      const updatedSVGs = addNewSVGs(existingSVGs, newSVGs);
      saveSVGs(updatedSVGs);

      console.log(`${GREEN}SVGs saved to ${DATA_FILE}${RESET}`);
    } else if (action.value === "view") {
      const svgs = loadExistingSVGs();
      console.log(`${CYAN}Stored SVGs:${RESET}`);
      svgs.forEach(svg => {
        console.log(`${GREEN}${svg.title}${RESET} (${svg.category})`);
      });
      console.log(`${CYAN}Total: ${svgs.length} SVGs${RESET}`);
    }
  }
}

// if (require.main === module) {
//   main().catch(console.error);
// }
main().catch(console.error);
