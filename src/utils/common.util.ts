/**
 * 根据某个属性排序
 * @param arr
 * @param propName
 * @param type
 */
export function sort(arr: any[], propName: string, type: Common.SortType) {
  arr.sort((a, b) => {
    if (type === 'asc') {
      return b[propName] - a[propName];
    } else {
      return a[propName] - b[propName];
    }
  });
}
