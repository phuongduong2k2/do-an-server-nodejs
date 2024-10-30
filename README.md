# Chạy lần lượt các command line dưới đây:
```
- git clone https://github.com/phuongduong2k2/do-an-server-nodejs
- cd do-an-server-nodejs
- npm install
```
# Config
```javascript
// mqtt connection
const mqttBrokerAddress = 'mqtt://192.168.1.11'; // <-- Sửa '192.168.1.11' lại bằng địa chỉ đã connect trên mqtt server trên raspi
const mqttChannel = 'your/channel'; // <-- Sủa lại bằng channel đã subscribe trên mqtt server trên raspi
```
# 
