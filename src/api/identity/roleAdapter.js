export function toRoleRequest(draft) {
    return {
        id: draft.id, name: draft.name, authCode: draft.authCode, dataScopeType: draft.dataScopeType,
        description: draft.description,
        deptIdArray: draft.dataScopeType === 5 ? [...draft.deptIdArray] : []
    };
}
