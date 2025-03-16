let colors = ["червоний", "синій", "зелений", "жовтий", "темно-синій", "білий"];

let longest = colors.reduce((a, b) => (a.length >= b.length ? a : b));
let shortest = colors.reduce((a, b) => (a.length <= b.length ? a : b));
console.log("1. Найдовший елемент масиву:", longest);
console.log("2. Найкоротший елемент масиву:", shortest);

colors = colors.filter(color => color.includes("синій"));
console.log("3. Масив після фільтрації (залишили тільки ті, що містять 'синій'):", colors);

let resultString = colors.join(", ");
console.log("4. Отриманий рядок:", resultString);
