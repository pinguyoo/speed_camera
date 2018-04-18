const linebot = require('linebot');
const express = require('express');
const bodyParser = require('body-parser')
const reply = require('./replyResult');
const cameraInfo = require('./cameraInfo');

// linebot with environment config 
const bot = linebot({
    channelId: process.env.channelId,
    channelSecret: process.env.channelSecret,
    channelAccessToken: process.env.channelAccessToken
});

const app = express();
const linebotParser = bot.parser();

app.post('/linewebhook', linebotParser);

// reply high way options of the path between origin and destination
bot.on('message', function (event) {
    console.log(event.message.text);
    cameraInfo(event.message.text).then((data) => {
        let cityName = [...new Set(data.cameras.map(camera => camera.CityName))];
        let carousels = [];
        for (let i = 0; i < cityName.length; i++) {
            carousels.push({ 
                thumbnailImageUrl: data.uri,
                title: cityName[i],
                text: '請選擇欲查詢的國道路線',
                actions: [{
                    type: 'postback',
                    label: cityName[i],
                    data: '{ "region":"' + cityName[i] + '", "address":"' + data.address + '"}'
                }]
            });
        }
        event.reply({
            type: 'template',
            altText: '測速照相地理位置',
            template: {
                type: 'carousel',
                columns: carousels
            }
        }).then(function (data) {
            console.log('Success', data);
        }).catch(function (error) {
            console.log('Error', error);
        });
    });
});


// reply camera locations with staticmap and detail infomation
bot.on('postback', function (event) {
    console.log(JSON.parse(event.postback.data));
    const result = JSON.parse(event.postback.data);
    reply(result).then((data) => {
        let carousels = [];
        console.log(data.uri);
        carousels.push({
            thumbnailImageUrl: data.uri,
            title: result.region,
            text: '點擊後查看詳細圖片',
            actions: [{
                type: 'uri',
                label: '點擊',
                uri: data.uri
            }]
        });
     
        for (let i = 0; i < data.cameras.length; i++) {
            carousels.push({
                thumbnailImageUrl: 'https://maps.googleapis.com/maps/api/staticmap?center=' + data.cameras[i].Latitude + ',' + data.cameras[i].Longitude + '&zoom=10&size=600x300&maptype=roadmap%20&markers=color:blue%7Clabel:S%7C' + data.cameras[i].Latitude + ',' + data.cameras[i].Longitude + '&key=' + process.env.STATICMAPKEY,
                title: data.cameras[i].Address,
                text: '座標: ' + data.cameras[i].Latitude + ',' + data.cameras[i].Longitude + '\n城市: ' + data.cameras[i].CityName + data.cameras[i].RegionName +
                    '\n方向: ' + data.cameras[i].direct + '   速限: ' + data.cameras[i].limit,
                actions: [{
                    type: 'uri',
                    label: '查看',
                    uri: 'https://maps.googleapis.com/maps/api/staticmap?center=' + data.cameras[i].Latitude + ',' + data.cameras[i].Longitude + '&zoom=10&size=600x300&maptype=roadmap%20&markers=color:blue%7Clabel:S%7C' + data.cameras[i].Latitude + ',' + data.cameras[i].Longitude + '&key=' + process.env.STATICMAPKEY
                }]
            });
        }
        
        event.reply({
            type: 'template',
            altText: '測速照相地理位置',
            template: {
                type: 'carousel',
                columns: carousels
            }
        }).then(function (data) {
            console.log('Success', data);
        }).catch(function (error) {
            console.log('Error', error);
        });
    });
});
app.listen(process.env.PORT || 80, function() {
    console.log('Line Bot is executing');
});