# Tháp biên giới - tháp nuôi cá

## Cấu trúc dự án: 
- /server: server của dự án
- /web: web client của tháp biên giới
- /web2: web client của tháp nuôi cá

## Yêu cầu cài đặt: 
- NodeJS
- MongoDB
- Yarn

## Setup: 
- Tại từng thư mục (`/server`, `/web`, `/web2`) chạy lệnh `yarn` để cài đặt hết thư viện
- Tạo file `.env` ứng với mỗi file `.env.example` có sẵn 
(nội dung các Key y hệt file `.env.example` tương ứng)
- Chi tiết các key: 
    - Server: 
        - NODE_ENV: development
        - PORT: cổng chạy server, giá trị mặc định `3001`
        - DB_URI: đường dẫn đến MongoDB, giá trị mặc định `mongodb://localhost:27017/thap-nang-luong`
    - Web:  
        - NODE_ENV: development
        - PORT: cổng chạy web client tháp biên giới, giá trị mặc định `3000`
        - REACT_APP_GRAPHQL_URI: đường dẫn đến server Graphql, giá trị mặc định `http://localhost:3001/graphql`
    - Web2: 
        - NODE_ENV: development
        - PORT: cổng chạy web client tháp biên giới, giá trị mặc định `3002`
        - REACT_APP_GRAPHQL_URI: đường dẫn đến server Graphql, giá trị mặc định `http://localhost:3001/graphql`

## Chạy dự án:
- Sau khi chạy `yarn` cài đặt hết thư viện ở 3 thư mục 
- Tại thư mục `/server` chạy `yarn dev` để chạy server
- Tại thư mục `/web` chạy `yarn dev` để chạy web tháp biên giới
- Tại thư mục `/web2` chạy `yarn dev` để chạy web tháp nuôi cá  
