const db = require('../db.js')

describe('db', () => {
    it('read is Function', () => {
        expect(db.read instanceof Function).toBe(true)
    })
    it('write is Function', () => {
        expect(db.write instanceof Function).toBe(true)
    })
})