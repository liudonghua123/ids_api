import { equal, throws } from 'assert';
import { expect } from 'chai';
import { getAttributes, saveUser, updateAttributes, updatePassword, updateManagerPassword, addUserToGroup, removeUserOfGroup, sendMessage, setBindingUserDefault, setUidSwitchDefault } from '../src/index';

const uid = 'abc';
describe('Typescript usage suite', function () {
    // https://mochajs.org/#timeouts
    // An outer value of 'this' is shadowed by this container.
    // this.timeout(0);
    it('getAttributes should return a object result', async () => {
        equal(typeof await getAttributes(uid), 'object');
    });
    it('saveUser should return empty string', async () => {
        const result = await saveUser({ uid, cn: 'abc', password: '123', status: 'Inactive', container: 'ou=student,ou=People', pwdPolicy: 1, memberOf: ['bk'] });
        equal(result.data, '');
    });
    it('updateAttributes should return empty string', async () => {
        const result = await updateAttributes(uid, { status: 'Active' });
        equal(result.data, '');
    });
    it('updatePassword should return empty string', async () => {
        const result = await updatePassword(uid, 'old_password', 'new_password');
        equal(result.data, '');
    });
    it('updateManagerPassword should return empty string', async () => {
        const result = await updateManagerPassword(uid, 'new_password');
        equal(result.data, '');
    });
    it('addUserToGroup should return empty string', async () => {
        const result = await addUserToGroup(uid, ['bk']);
        equal(result.data, '');
    });
    it('removeUserOfGroup should return empty string', async () => {
        const result = await removeUserOfGroup(uid, ['bk']);
        equal(result.data, '');
    });
    it('sendMessage should return empty string', async () => {
        const result = await sendMessage(uid, 'title', 'content');
        equal(result.data, '');
    });
    it('setBindingUserDefault should return empty string', async () => {
        const result = await setBindingUserDefault(uid, 'defaultUid');
        equal(result.data, '');
    });
    it('setUidSwitchDefault should return empty string', async () => {
        const result = await setUidSwitchDefault(uid, 'defaultUserNO');
        equal(result.data, '');
    });
});