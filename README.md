# Chạy lần lượt các command line dưới đây:
```
- git clone https://github.com/phuongduong2k2/do-an-server-nodejs
- cd do-an-server-nodejs
- npm install
```
# Config
> ./do-an-server-nodejs/src/app.js
```javascript
// mqtt connection
const mqttBrokerAddress = 'mqtt://192.168.1.11'; // <-- Sửa '192.168.1.11' lại bằng địa chỉ đã connect trên mqtt server trên raspi
const mqttChannel = 'your/channel'; // <-- Sủa lại bằng channel đã subscribe trên mqtt server trên raspi
```
# Flow
Web server gửi 1 message đến cho borker server mqtt chạy trên raspi
> ./do-an-server-nodejs/src/app.js
```javascript
app.post('/control-servo/:id', (req, res) => {
  //   req.body = {
  //     id: 1, <-- id servo cần điều khiển
  //     degree: 180, <-- góc
  //   };

  const servoId = req.body.id;
  const degree = req.body.degree;
  const message = `servo:${servoId}:${degree}`;

  client.publish(mqttChannel, message, () => {
    console.log(`Message published to ${mqttChannel}:${message}`);
    res.status(200).json({
      message: 'success',
    });
  });
});
```
Broker server mqtt nhận được message từ web server rồi xử lý:
> ./mqtt-server.py
```python
import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, rc):
  print(f"Connected with result code {rc}")
  client.subscribe("your/channel") # <-- tạo kênh 'your/channel' để web server nối đến

def on_message(client, userdata, msg):
  print(f"Received message on topic {msg.topic}: {msg.payload}")

  res = msg.payload.split(":")
  # res[0] = "servo" <-- tên module cần điều khiển
  # res[1] = "servoId" <-- tên module cần điều khiển
  # res[2] = "degree" <-- tên module cần điều khiển

  if res[0] == b"servo":
    try:
      # gọi function điều khiển servo và có thể truyền servoId, degree vào
      print("Control servo")
    except Exception as e:
      print(e)
  else:
    print("Not control")
  # Thêm các logic khác để điểu khiển led, cảm biến vân tay, ...

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("localhost", 1883, 60) # Sửa 'localhost' thành địa chỉ broker server mqtt
print("Listening forever")
...
```
# Video ví dụ về cách kết nối giao thức mqtt
[vi rút](https://www.youtube.com/watch?v=OQC9ZYkeKNI)
