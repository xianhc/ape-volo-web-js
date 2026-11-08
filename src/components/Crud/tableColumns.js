function isBusinessColumn(column) {
    return !column.type && column.placement !== 'end';
}
export function createColumnPreferences(columns) {
    const keys = new Set();
    for (const column of columns) {
        if (keys.has(column.key))
            throw new Error(`重复表格列 key: ${column.key}`);
        keys.add(column.key);
    }
    const grouped = [
        ...columns.filter(c => c.placement === 'start'),
        ...columns.filter(c => !c.placement || c.placement === 'normal'),
        ...columns.filter(c => c.placement === 'end')
    ];
    const state = grouped.map(c => ({ key: c.key, visible: !!c.required || c.defaultVisible !== false }));
    if (!columns.some(c => isBusinessColumn(c) && state.find(s => s.key === c.key)?.visible)) {
        const first = columns.find(isBusinessColumn);
        const item = state.find(s => s.key === first?.key);
        if (item)
            item.visible = true;
    }
    return state;
}
export function setColumnVisibility(columns, state, key, visible) {
    const column = columns.find(c => c.key === key);
    const result = state.map(c => ({ ...c }));
    if (!column || (!visible && column.required))
        return result;
    if (!visible
        && isBusinessColumn(column)
        && !columns.some(c => c.key !== key
            && isBusinessColumn(c)
            && state.find(s => s.key === c.key)?.visible))
        return result;
    const item = result.find(c => c.key === key);
    if (item)
        item.visible = visible;
    return result;
}
export function moveColumn(columns, state, source, target) {
    const result = state.map(c => ({ ...c }));
    /**
     * 判断当前项目是否允许参与排序移动。
     * @param key 当前查询、映射或缓存使用的键。
     * @returns 当前项目是否允许参与排序移动时返回 true，否则返回 false。
     */
    const movable = (key) => {
        const column = columns.find(c => c.key === key);
        return column && (!column.placement || column.placement === 'normal');
    };
    if (!movable(source) || !movable(target))
        return result;
    const from = result.findIndex(c => c.key === source);
    const to = result.findIndex(c => c.key === target);
    if (from < 0 || to < 0 || from === to)
        return result;
    const [item] = result.splice(from, 1);
    result.splice(to, 0, item);
    return result;
}
