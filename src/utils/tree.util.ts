/**
 * 将数组变成树
 * @param list
 * @param rootId
 * @param options
 * @returns
 */
export function getTreeByList(
  list: Common.List,
  rootId: number,
  options?: Common.TreeOption,
) {
  // 属性配置设置
  const attr = {
    id: options?.id || 'id',
    parentId: options?.parentId || 'parentId',
    rootId,
  };
  const toTreeData = (
    data: Common.List,
    attr: {
      id: string;
      parentId: string;
      rootId: number;
    },
  ) => {
    const tree: Common.TreeNode[] = [];
    const resData: Common.List = data;
    for (let i = 0; i < resData.length; i++) {
      if (resData[i].parentId === attr.rootId) {
        const obj = {
          ...resData[i],
          id: resData[i][attr.id] as number,
          children: [],
        };
        tree.push(obj as unknown as Common.TreeNode);
        resData.splice(i, 1);
        i--;
      }
    }
    const run = (treeArrs: Common.TreeNode[]) => {
      if (resData.length > 0) {
        for (let i = 0; i < treeArrs.length; i++) {
          for (let j = 0; j < resData.length; j++) {
            if (treeArrs[i].id === resData[j][attr.parentId]) {
              const obj: Common.TreeNode = {
                ...resData[j],
                id: resData[j][attr.id] as number,
                children: [],
              } as unknown as Common.TreeNode;
              treeArrs[i].children.push(obj);
              resData.splice(j, 1);
              j--;
            }
          }
          run(treeArrs[i].children);
        }
      }
    };
    run(tree);
    return tree;
  };
  const arr = toTreeData(list, attr);
  return arr;
}
