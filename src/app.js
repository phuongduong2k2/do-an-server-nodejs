const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const mqtt = require('mqtt');
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mqtt connection
const mqttBrokerAddress = 'mqtt://192.168.1.11'; // <-- Sửa lại bằng địa chỉ đã connect trên mqtt server trên raspi
const mqttChannel = 'mychannel'; // <-- Sủa lại bằng channel đã subscribe trên mqtt server trên raspi

const client = mqtt.connect(mqttBrokerAddress);

// send message to raspi to control servo
app.post('/control-servo/:id', (req, res) => {
  const message = `servo${req.params.id}`;

  console.log(req.body);
  //   req.body = {
  //     id: 1, <-- id servo cần điều khiển
  //     degree: 180, <-- góc
  //   };

  client.publish(mqttChannel, message, () => {
    console.log(`Message published to ${mqttChannel}:${message}`);
    res.status(200).json({
      message: 'success',
    });
  });
});

app.use('/', require('./routes'));

module.exports = app;
