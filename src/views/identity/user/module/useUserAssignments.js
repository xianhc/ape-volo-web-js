import { nextTick, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { editUserPosition, editUserRole } from "../../../../api/identity/user.js";
/** 行内授权拥有自己的提交锁与回滚快照，不与表单草稿共享状态。 */
export function useUserAssignments() {
    const assignmentPending = reactive({});
    const snapshots = new Map();
    const keyOf = (row, field) => `${row.id}:${field}`;
    const copy = (items) => items.map(item => ({ ...item }));
    const save = async (row, field) => {
        await nextTick();
        const key = keyOf(row, field);
        const previous = snapshots.get(key);
        if (assignmentPending[key] || !previous)
            return;
        const ids = row[field].map(item => item.id);
        if (previous.map(item => item.id).sort().join(',') === [...ids].sort().join(',')) {
            snapshots.delete(key);
            return;
        }
        assignmentPending[key] = true;
        try {
            if (field === 'roles')
                await editUserRole({ id: row.id, roleIdArray: ids });
            else
                await editUserPosition({ id: row.id, positionIdArray: ids });
            ElMessage.success(field === 'roles' ? '角色修改成功' : '岗位修改成功');
        }
        catch {
            row[field] = previous;
        }
        finally {
            snapshots.delete(key);
            assignmentPending[key] = false;
        }
    };
    const visible = (row, field, open) => {
        if (open)
            snapshots.set(keyOf(row, field), copy(row[field]));
        else
            void save(row, field);
    };
    const remove = (row, field, removed) => {
        const key = keyOf(row, field);
        if (!snapshots.has(key))
            snapshots.set(key, copy([...row[field], removed]));
        void save(row, field);
    };
    return {
        assignmentPending,
        handleRoleVisibleChange: (row, open) => visible(row, 'roles', open),
        handleRoleRemove: (row, removed) => remove(row, 'roles', removed),
        handlePositionVisibleChange: (row, open) => visible(row, 'positions', open),
        handlePositionRemove: (row, removed) => remove(row, 'positions', removed)
    };
}

