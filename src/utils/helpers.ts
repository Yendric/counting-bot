import { NumIcons } from "@/types";

export const numIcons: NumIcons = {
  0: ["0️⃣", "😀", "😃", "😄"],
  1: ["1️⃣", "😁", "😆", "🥹"],
  2: ["2️⃣", "😅", "😂", "🤣"],
  3: ["3️⃣", "🥲", "☺️", "😊"],
  4: ["4️⃣", "🤪", "🤨", "🧐"],
  5: ["5️⃣", "😛", "😝", "😜"],
  6: ["6️⃣", "😙", "😚", "😋"],
  7: ["7️⃣", "🥰", "😘", "😗"],
  8: ["8️⃣", "😉", "😌", "😍"],
  9: ["9️⃣", "😇", "🙂", "🙃"],
};

export function numToIcons(num: number): string[] {
  let usedNums: { [key: number]: number } = {};
  console.log(num.toString().split(""))
  return num.toString().split("").map((num) => usedNums[parseInt(num)] !== undefined
    ? numIcons[parseInt(num)][++usedNums[parseInt(num)]] 
    : numIcons[parseInt(num)][usedNums[parseInt(num)] = 0]
  );
}