# Tháp biên giới - tháp nuôi cá

## Cấu trúc dự án: 
- /server: server của dự án
- /web: web client của tháp biên giới
- /web2: web client của tháp nuôi cá

## Yêu cầu cài đặt: 
- NodeJS
- MongoDB
- MQTT server (Mosquitto)
- Yarn

## Setup: 
- Tại từng thư mục (`/server`, `/web`, `/web2`) chạy lệnh `yarn` hoặc `npm install` để cài đặt hết thư viện
- Tạo file `.env` ứng với mỗi file `.env.example` có sẵn 
(nội dung các biến môi trường y hệt trong file `.env.example` tương ứng)
- Ý nghĩa các key: 
    - Server: 
        - NODE_ENV: môi trường node (development/production)
        - PORT: cổng chạy server, giá trị mặc định `3001`
        - DB_URI: đường dẫn đến mongoDB, giá trị mặc định `mongodb://localhost:27017/thap-nang-luong`
    - Web:  
        - NODE_ENV: môi trường node (development/production)
        - PORT: cổng chạy web client tháp biên giới, giá trị mặc định `3000`
        - REACT_APP_GRAPHQL_URI: đường dẫn đến server Graphql, giá trị mặc định `http://localhost:3001/graphql`
        - REACT_APP_MAP_API_KEY: javascript Google Maps API Key.
    - Web2: 
        - NODE_ENV: môi trường node (development/production)
        - PORT: cổng chạy web client tháp biên giới, giá trị mặc định `3002`
        - REACT_APP_GRAPHQL_URI: đường dẫn đến server Graphql, giá trị mặc định `http://localhost:3001/graphql`

## Chạy dự án:
- Sau khi chạy `yarn` cài hết thư viện ở 3 thư mục 
- Tại thư mục `/server` chạy `yarn dev` để chạy server
- Tại thư mục `/web` chạy `yarn dev` để chạy web tháp biên giới
- Tại thư mục `/web2` chạy `yarn dev` để chạy web tháp nuôi cá  
