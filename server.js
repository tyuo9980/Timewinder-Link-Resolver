var express = require('express');
var app = express();
var cors = require('cors');
var request = require('request');

var corsOptions = {
  origin: /^[^.\s]+\.mixmax\.com$/,
  credentials: true
};

app.get('/resolver', cors(corsOptions), function(req, res){
    var url = req.query.url.trim();

    var matches = url.match(/[a-zA-z0-9]+\/na$/);
    if (!matches){
        res.status(400).send('Invalid URL');
        return;
    }

    console.log(matches);

    var response = request({
        url: 'http://timewinder.gg/api/mixmax/' + encodeURIComponent(matches[0]),
        method: 'GET',
        json: true,
        timeout: 5000
    }, 
    function(error, response, body){
        if (error) {
            res.status(400).send(error);
        } else {
            console.log(response.statusCode, body);

            var html = '<div style="padding-top:4px; padding-bottom: 4px; font-family: Arial;">'
            +'<img src="http://timewinder.gg/img/6.1.1/profileicon/'+body.ProfileIcon+'.png">'
            +'<a style="margin:4px 0; text-decoration:none; display:block; color:#333; border:none; font-size: 20px" href="http://timewinder.gg/p/'+matches[0]+'">'+body.Name+'</a>'
            +'<p style="margin:0; font-size:14px">'+body.Tier+' '+body.Division+'</p>'
            +'<p style="margin:0; font-size:14px">'+body.Wins+'W '+body.Losses+'L'+'</p>'
            +'<a style="margin:4px 0; color:#aab; display:block; font-size:11px; text-decoration:none; text-transform:uppercase;" href="http://timewinder.gg/p/'+matches[0]+'" target="_blank">timewinder.gg</a>'
            +'</div>';
            
            res.json({
                body: html
            });
        }
    });
});

app.listen(process.env.PORT || 9001);