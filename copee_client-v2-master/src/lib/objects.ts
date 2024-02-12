type ObjectType<T> = {
  [key: string]: T;
};

export function compareObjects<T>(
  objetA: ObjectType<T>,
  objetB: ObjectType<T>
): boolean {
  const clesObjetA = Object.keys(objetA);
  // const clesObjetB = Object.keys(objetB);
  // if (clesObjetA.length !== clesObjetB.length) {
  //   return false;
  // }

  for (const cle of clesObjetA) {
    if (objetA[cle] !== objetB[cle]) {
      return false;
    }
  }
  return true;
}

export const turnObjectPropsToUrlParams = <T>(
  requestArgs: ObjectType<T>
): string => {
  return Object.entries(requestArgs)
    .map(([prop, valeur]) => `&${prop}=${valeur}`)
    .join("");
};
