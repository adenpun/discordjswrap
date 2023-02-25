// export function Omit<Class extends new (...args: any[]) => any, Property extends keyof Class>(
//     _class: Class,
//     property: Property[]
// ): Omit<Class, typeof property[number]> {
//     let output = structuredClone(_class);
//     property.forEach((v) => {
//         delete output.prototype[v];
//     });
//     return output;
// }
