var Add = artifacts.require("./Add.sol");

contract('Add', (accounts) => {

    var addInstance;

    beforeEach('setup contract for each test', async() => {
        addInstance  = await Add.new();
    })

    it("should be 2 the current value ", async() =>  {
        await addInstance.addValue(2);
        var x = await addInstance.getValue()
        assert.equal(x.valueOf(), 2, "2 wasn't the");
    });

    it("should be 5 the current value ", async() =>  {
        await addInstance.addValue(2);
        await addInstance.addValue(3);
        var x = await addInstance.getValue()
        assert.equal(x.valueOf(), 5, "5 wasn't the");
    });

    it("should be 0 when reset ", async() =>  {
        await addInstance.addValue(5);
        await addInstance.resetValue();
        var x = await addInstance.getValue()
        assert.equal(x.valueOf(), 0, "0 wasn't the");
    });

});
