export const StatusCodeData1h = {
    overall: {
        200: 12450,
        201: 450,
        400: 320,
        401: 150,
        403: 210,
        404: 600,
        500: 120,
        502: 60
    },
    endpoints: [
        {
            name: "GET /users",
            codes: { 200: 8200, 404: 120, 500: 35 }
        },
        {
            name: "POST /login",
            codes: { 200: 3900, 400: 200, 401: 140, 500: 85 }
        }
    ]
};

export const StatusCodeData6h = {
    overall: {
        200: 68200,
        201: 2100,
        400: 1800,
        401: 950,
        403: 700,
        404: 2600,
        500: 640,
        502: 210
    },
    endpoints: [
        {
            name: "GET /users",
            codes: { 200: 43000, 404: 650, 500: 120 }
        },
        {
            name: "POST /login",
            codes: { 200: 21000, 400: 950, 401: 800, 500: 240 }
        }
    ]
};

export const StatusCodeData24h = {
    overall: {
        200: 240000,
        201: 8500,
        400: 6200,
        401: 3900,
        403: 2800,
        404: 9200,
        500: 2400,
        502: 800
    },
    endpoints: [
        {
            name: "GET /users",
            codes: { 200: 150000, 404: 2300, 500: 450 }
        },
        {
            name: "POST /login",
            codes: { 200: 76000, 400: 3100, 401: 2900, 500: 1200 }
        }
    ]
};

export const StatusCodeData7d = {
    overall: {
        200: 1650000,
        201: 42000,
        400: 38000,
        401: 26000,
        403: 19000,
        404: 71000,
        500: 18000,
        502: 6400
    },
    endpoints: [
        {
            name: "GET /users",
            codes: { 200: 1020000, 404: 18000, 500: 3500 }
        },
        {
            name: "POST /login",
            codes: { 200: 540000, 400: 21000, 401: 19000, 500: 9200 }
        }
    ]
};

export const StatusCodeData30d = {
    overall: {
        200: 6200000,
        201: 155000,
        400: 142000,
        401: 98000,
        403: 76000,
        404: 265000,
        500: 69000,
        502: 22000
    },
    endpoints: [
        {
            name: "GET /users",
            codes: { 200: 3800000, 404: 72000, 500: 13000 }
        },
        {
            name: "POST /login",
            codes: { 200: 2000000, 400: 84000, 401: 75000, 500: 42000 }
        }
    ]
};