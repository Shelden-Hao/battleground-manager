import {request} from "@umijs/max";

/**
 * 获取用户列表
 */
export const getUsersList = () => {
    return request('/api/users', {
        method: 'GET',
    });
}

/**
 * 删除用户
 * @param id
 */
export const deleteUserById = (id: number) => {
    return request(`/api/users/${id}`, {
        method: 'DELETE',
    });
}

/**
 * 更新用户信息
 * @param newInfo
 */
export const updateUser = (id: number, newInfo) => {
    return request(`/api/users/${id}`, {
        method: 'PUT',
        data: newInfo,
    });
}

/**
 * 创建用户
 * @param newInfo
 */
export const createUser = (newInfo) => {
    return request('/api/users', {
        method: 'POST',
        data: newInfo,
    });
}

/**
 * 根据id获取用户
 * @param id
 */
export const getUserById = (id: number) => {
    return request(`/api/users/${id}`, {
        method: 'GET',
    });
}
