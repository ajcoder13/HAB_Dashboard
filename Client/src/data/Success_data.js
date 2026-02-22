export const SuccessData1h = {
    labels: ["0m","10m","20m","30m","40m","50m","60m"],
    overall: {
        success: [96,95,97,94,96,98,97],
        error:   [4,5,3,6,4,2,3],
        server:  [1,2,1,3,1,1,2]
    },
    endpoints: [
        {
            name: "GET /users",
            success: [98,97,99,96,98,99,98],
            error:   [2,3,1,4,2,1,2],
            server:  [1,1,0,2,1,0,1]
        },
        {
            name: "POST /login",
            success: [92,90,94,89,91,93,92],
            error:   [8,10,6,11,9,7,8],
            server:  [3,4,2,5,3,2,3]
        }
    ]
};

export const SuccessData6h = {
    labels: ["0h","1h","2h","3h","4h","5h","6h"],
    overall: {
        success: [95,94,96,93,97,96,98],
        error:   [5,6,4,7,3,4,2],
        server:  [2,3,2,4,1,2,1]
    },
    endpoints: [
        {
            name: "GET /users",
            success: [97,96,98,95,99,98,99],
            error:   [3,4,2,5,1,2,1],
            server:  [1,2,1,3,0,1,0]
        },
        {
            name: "POST /login",
            success: [90,89,92,88,91,90,93],
            error:   [10,11,8,12,9,10,7],
            server:  [4,5,3,6,3,4,2]
        }
    ]
};

export const SuccessData24h = {
    labels: ["0h","4h","8h","12h","16h","20h","24h"],
    overall: {
        success: [94,95,93,96,97,95,98],
        error:   [6,5,7,4,3,5,2],
        server:  [3,2,4,2,1,2,1]
    },
    endpoints: [
        {
            name: "GET /users",
            success: [96,97,95,98,99,97,99],
            error:   [4,3,5,2,1,3,1],
            server:  [2,1,3,1,0,1,0]
        },
        {
            name: "POST /login",
            success: [88,90,87,91,92,89,94],
            error:   [12,10,13,9,8,11,6],
            server:  [5,4,6,3,3,4,2]
        }
    ]
};

export const SuccessData7d = {
    labels: ["Day1","Day2","Day3","Day4","Day5","Day6","Day7"],
    overall: {
        success: [93,94,95,96,94,97,98],
        error:   [7,6,5,4,6,3,2],
        server:  [3,3,2,2,3,1,1]
    },
    endpoints: [
        {
            name: "GET /users",
            success: [95,96,97,98,96,99,99],
            error:   [5,4,3,2,4,1,1],
            server:  [2,2,1,1,2,0,0]
        },
        {
            name: "POST /login",
            success: [87,88,90,92,89,91,94],
            error:   [13,12,10,8,11,9,6],
            server:  [6,5,4,3,4,3,2]
        }
    ]
};

export const SuccessData30d = {
    labels: ["Week1","Week2","Week3","Week4"],
    overall: {
        success: [92,94,96,97],
        error:   [8,6,4,3],
        server:  [4,3,2,1]
    },
    endpoints: [
        {
            name: "GET /users",
            success: [94,96,98,99],
            error:   [6,4,2,1],
            server:  [3,2,1,0]
        },
        {
            name: "POST /login",
            success: [85,88,92,95],
            error:   [15,12,8,5],
            server:  [7,5,3,2]
        }
    ]
};