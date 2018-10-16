pragma solidity ^0.4.24;

contract Quiz {
    address owner;
    struct userInfo {
        uint256 id;
        uint256 result;
        bool enrolled;
    }
    mapping(uint256 => userInfo) testResult;
    uint256 public userCount = 0;

    modifier onlyowner(){
        if(owner==msg.sender) _;
    }
    constructor() public {
        owner = msg.sender;
    }
    
    function getResult(uint256 id) public view returns(uint256 result, bool enrolled){
        return(testResult[id].result,testResult[id].enrolled);
    }

    function addTestResult(uint256 id, uint256 newResult) public onlyowner returns(uint8){
        if(testResult[id].enrolled){
            if(testResult[id].result < newResult){
                testResult[id].result = newResult;
                return 1;
            }
            else{
                return 2;
            }
        }
        else{
            userInfo memory newUser = userInfo(id,newResult,true);
            testResult[id] = newUser;
            userCount += 1;
            return 0;
        }
    }
}