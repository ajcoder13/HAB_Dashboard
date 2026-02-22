export const RpsData1h = {
    labels: ["0m", "10m", "20m", "30m", "40m", "50m", "60m"],
    endpoints: [
        { name: "GET /users", data: [120, 140, 160, 150, 170, 180, 175] },
        { name: "POST /login", data: [80, 95, 110, 100, 120, 130, 125] },
        { name: "GET /orders", data: [60, 75, 90, 85, 100, 105, 110] },
        { name: "PUT /profile", data: [40, 50, 65, 70, 75, 80, 85] },
        { name: "DELETE /cart", data: [20, 25, 30, 28, 35, 40, 38] }
    ],
    services: [
        { name: "gateway", data: [200, 230, 260, 250, 280, 300, 295] },
        { name: "v1", data: [90, 100, 120, 115, 130, 140, 145] },
        { name: "v2", data: [30, 40, 45, 50, 55, 60, 58] }
    ]
};

export const RpsData6h = {
    labels: ["0h", "1h", "2h", "3h", "4h", "5h", "6h"],
    endpoints: [
        { name: "GET /users", data: [100, 120, 150, 140, 160, 170, 180] },
        { name: "POST /login", data: [70, 80, 100, 95, 110, 120, 130] },
        { name: "GET /orders", data: [50, 60, 75, 70, 85, 90, 95] },
        { name: "PUT /profile", data: [30, 40, 55, 60, 65, 70, 75] },
        { name: "DELETE /cart", data: [15, 20, 25, 22, 30, 35, 40] }
    ],
    services: [
        { name: "gateway", data: [170, 200, 240, 230, 260, 280, 300] },
        { name: "v1", data: [80, 90, 110, 105, 120, 130, 140] },
        { name: "v2", data: [25, 35, 40, 45, 50, 55, 60] }
    ]
};

export const RpsData24h = {
    labels: ["0h", "4h", "8h", "12h", "16h", "20h", "24h"],
    endpoints: [
        { name: "GET /users", data: [90, 110, 140, 130, 150, 165, 170] },
        { name: "POST /login", data: [60, 75, 95, 90, 105, 115, 120] },
        { name: "GET /orders", data: [45, 55, 70, 65, 80, 85, 90] },
        { name: "PUT /profile", data: [25, 35, 50, 55, 60, 65, 70] },
        { name: "DELETE /cart", data: [10, 15, 20, 18, 25, 30, 35] }
    ],
    services: [
        { name: "gateway", data: [150, 180, 220, 210, 240, 260, 270] },
        { name: "v1", data: [70, 85, 100, 95, 110, 120, 130] },
        { name: "v2", data: [20, 30, 35, 40, 45, 50, 55] }
    ]
};

export const RpsData7d = {
    labels: ["Day1", "Day2", "Day3", "Day4", "Day5", "Day6", "Day7"],
    endpoints: [
        { name: "GET /users", data: [80, 95, 120, 110, 130, 140, 150] },
        { name: "POST /login", data: [50, 65, 85, 75, 90, 100, 110] },
        { name: "GET /orders", data: [40, 50, 65, 60, 75, 80, 85] },
        { name: "PUT /profile", data: [20, 30, 45, 50, 55, 60, 65] },
        { name: "DELETE /cart", data: [8, 12, 18, 15, 22, 25, 30] }
    ],
    services: [
        { name: "gateway", data: [130, 150, 190, 180, 210, 230, 240] },
        { name: "v1", data: [60, 75, 90, 85, 100, 110, 120] },
        { name: "v2", data: [15, 25, 30, 35, 40, 45, 50] }
    ]
};

export const RpsData30d = {
    labels: ["Week1", "Week2", "Week3", "Week4"],
    endpoints: [
        { name: "GET /users", data: [70, 90, 110, 130] },
        { name: "POST /login", data: [45, 60, 80, 95] },
        { name: "GET /orders", data: [35, 50, 65, 75] },
        { name: "PUT /profile", data: [18, 28, 40, 55] },
        { name: "DELETE /cart", data: [5, 10, 15, 20] }
    ],
    services: [
        { name: "gateway", data: [120, 150, 190, 220] },
        { name: "v1", data: [55, 70, 90, 110] },
        { name: "v2", data: [12, 20, 30, 40] }
    ]
};