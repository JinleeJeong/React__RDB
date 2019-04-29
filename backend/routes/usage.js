var express = require('express');
var router = express.Router();
var models = require("../models/index.js");
var sequelize = require('sequelize')

const Op = sequelize.Op;
var failedResultCode = 400;
var successResultCode = 200;
var successMessage = 'success';
var failedMessage =  'failed';
/* GET users listing. */
router.post('/sp/stusg', (req,res,next) => {
  var startChoose =  new Date(req.body.startChoose);
  var endChoose =  new Date(req.body.endChoose);
  startChoose.setHours(startChoose.getHours() + 9);
  endChoose.setHours(endChoose.getHours() + 9);
  console.log(startChoose);
  console.log(endChoose);
  models.stlogs.findAll({where : {starttime : { [Op.gte] : startChoose,
                                                [Op.lte] : endChoose},
                                  endtime : { [Op.gte] : startChoose,
                                              [Op.lte] : endChoose}},
      include : [
    {
        model : models.students,
        attributes : [`id_st`, `id_tc`, `name_st`],
        where : sequelize.where(
        sequelize.col('stlogs.id_st'),
        sequelize.col('student.id_st')
        )
    }
  ], order : [
      'id_app'
  ]
  , attributes : [`id_app`, `name_app`, `starttime`, `endtime`]})
  .then((stUsage) => {

    console.log(stUsage.length);

    var result = []
    var jsonResult = []
    var teachersName = []
    var startTime, endTime, hDiff, minDiff, minDiffForHours;
    var usageArray = [];
    var minResult = 0;

    for(var i = 0 ; i<stUsage.length ; i++){
        if(stUsage[i].endtime !== null){

            
            startTime = new Date(stUsage[i].starttime);
            endTime = new Date(stUsage[i].endtime);
            minResult = Math.abs(startTime - endTime);
            minDiff = Math.floor(((minResult/1000) / 60) % 60);
            minDiffForHours = Math.floor((minResult/1000) / 60);
            hDiff = Math.floor((minDiffForHours / 60));

            usageArray.push({
                stName : stUsage[i].student.name_st,
                tcId : stUsage[i].student.id_tc,
                appId : stUsage[i].id_app,
                appName : stUsage[i].name_app,
                usage : minDiff,
                usageHours : hDiff,
            })
        }
    }

    // obj key value에 따른 New Array Obj 생성
    usageArray.forEach(function (o) {
        if (!this[o.appId]) {
            this[o.appId] = { stName : o.stName, tcId : o.tcId, appId: o.appId, appName : o.appName, usage: 0, usageHours :0};
            result.push(this[o.appId]);
        }
        this[o.appId].usage += o.usage;
        this[o.appId].usageHours += o.usageHours;
    }, Object.create(null));
    
    for(var i = 0 ; i < result.length ; i++){
        models.teachers.findOne({where : {id_tc : result[i].tcId}})
        .then((teachers) => {
            if(teachers !== null) {
                teachersName.push({ tcName : teachers.name_tc})
            }
            else {
                console.log("Teachers Not existes");
            }
        }).catch(() => {
            console.log("Teachers Not exist");
        })
    }

    setTimeout(() => {
        for(var i = 0 ; i < result.length;  i++) {
            var finalUsage = result[i].usageHours + '시간 ' + result[i].usage + '분 사용';
            jsonResult.push({
                key : i,
                stName : result[i].stName,
                tcName : teachersName[i].tcName,
                appId : result[i].appId,
                appName : result[i].appName,
                usage : finalUsage
            })
        }
        console.log('jsonResult',jsonResult);

        res.json({
            resultCode : successResultCode,
            message : successMessage,
            stUsages : jsonResult
        });
    }, 3000)
})
  .catch(() => {
      res.json("일치하는 정보가 없습니다.");
  })
});

//================================================================================================

router.post('/sp/ingangusg', (req,res,next) => {
    var startChoose =  new Date(req.body.startChoose);
    var endChoose =  new Date(req.body.endChoose);
    startChoose.setHours(startChoose.getHours() + 9);
    endChoose.setHours(endChoose.getHours() + 9);
    console.log(startChoose);
    console.log(endChoose);

    models.stlogs.findAll({where : {starttime : { [Op.gte] : startChoose,
                                                  [Op.lte] : endChoose},
                                    endtime : { [Op.gte] : startChoose,
                                                [Op.lte] : endChoose}},
        include : [
      {
          model : models.applist,
          attributes : [`b_ingang`],
          where : sequelize.where(
              sequelize.col('stlogs.id_app'),
              sequelize.col('applist.id_app'),
              
          )
      }
    ], order : [
        'id_app'
    ]
    , attributes : [`id_app`, `name_app`, `starttime`, `endtime`]})
    .then((ingangUsg) => {
  
      console.log(ingangUsg.length);
  
      var result = []
      var jsonResult = []
      var startTime, endTime, hDiff, minDiff, minDiffForHours;
      var usageArray = [];
      var minResult = 0;
  
      for(var i = 0 ; i<ingangUsg.length ; i++){
          if(ingangUsg[i].endtime !== null && ingangUsg[i].applist.b_ingang === true){
  
              
              startTime = new Date(ingangUsg[i].starttime);
              endTime = new Date(ingangUsg[i].endtime);
              minResult = Math.abs(startTime - endTime);
              minDiff = Math.floor(((minResult/1000) / 60) % 60);
              minDiffForHours = Math.floor((minResult/1000) / 60);
              hDiff = Math.floor((minDiffForHours / 60));
  
              usageArray.push({
                  appId : ingangUsg[i].id_app,
                  appName : ingangUsg[i].name_app,
                  usage : minDiff,
                  usageHours : hDiff,
              })
          }
      }
  
      // obj key value에 따른 New Array Obj 생성
      usageArray.forEach(function (o) {
          if (!this[o.appId]) {
              this[o.appId] = {appId: o.appId, appName : o.appName, usage: 0, usageHours :0};
              result.push(this[o.appId]);
          }
          this[o.appId].usage += o.usage;
          this[o.appId].usageHours += o.usageHours;
      }, Object.create(null));
    
      setTimeout(() => {
          for(var i = 0 ; i < result.length;  i++) {
              var finalUsage = result[i].usageHours + '시간 ' + result[i].usage + '분 사용';
              jsonResult.push({
                  key : i,
                  appId : result[i].appId,
                  appName : result[i].appName,
                  usage : finalUsage
              })
          }
          console.log('jsonResult',jsonResult);
  
          res.json({
              resultCode : successResultCode,
              message : successMessage,
              ingangUsages : jsonResult
          });
      }, 3000)
  })
    .catch(() => {
        res.json("일치하는 정보가 없습니다.");
    })
  });
//================================================================================================

router.post('/sp/disableappusg', (req,res,next) => {
    var startChoose =  new Date(req.body.startChoose);
    var endChoose =  new Date(req.body.endChoose);
    startChoose.setHours(startChoose.getHours() + 9);
    endChoose.setHours(endChoose.getHours() + 9);
    console.log(startChoose);
    console.log(endChoose);

    models.stlogs.findAll({where : {starttime : { [Op.gte] : startChoose,
                                                  [Op.lte] : endChoose},
                                    endtime : { [Op.gte] : startChoose,
                                                [Op.lte] : endChoose}},
        include : [
      {
          model : models.applist,
          attributes : [`b_ingang`],
          where : sequelize.where(
              sequelize.col('stlogs.id_app'),
              sequelize.col('applist.id_app'),
              
          )
      }
    ], order : [
        'id_app'
    ]
    , attributes : [`id_app`, `name_app`, `starttime`, `endtime`]})
    .then((appUsg) => {
  
      console.log(appUsg.length);
  
      var result = []
      var jsonResult = []
      var startTime, endTime, hDiff, minDiff, minDiffForHours;
      var usageArray = [];
      var minResult = 0;
  
      for(var i = 0 ; i<appUsg.length ; i++){
          if(appUsg[i].endtime !== null){
  
              
              startTime = new Date(appUsg[i].starttime);
              endTime = new Date(appUsg[i].endtime);
              minResult = Math.abs(startTime - endTime);
              minDiff = Math.floor(((minResult/1000) / 60) % 60);
              minDiffForHours = Math.floor((minResult/1000) / 60);
              hDiff = Math.floor((minDiffForHours / 60));
  
              usageArray.push({
                  appId : appUsg[i].id_app,
                  appName : appUsg[i].name_app,
                  usage : minDiff,
                  usageHours : hDiff,
              })
          }
      }
  
      // obj key value에 따른 New Array Obj 생성
      usageArray.forEach(function (o) {
          if (!this[o.appId]) {
              this[o.appId] = {appId: o.appId, appName : o.appName, usage: 0, usageHours :0};
              result.push(this[o.appId]);
          }
          this[o.appId].usage += o.usage;
          this[o.appId].usageHours += o.usageHours;
      }, Object.create(null));
    
      setTimeout(() => {
          for(var i = 0 ; i < result.length;  i++) {
              var finalUsage = result[i].usageHours + '시간 ' + result[i].usage + '분 사용';
              jsonResult.push({
                  key : i,
                  appId : result[i].appId,
                  appName : result[i].appName,
                  usage : finalUsage
              })
          }
          console.log('jsonResult',jsonResult);
  
          res.json({
              resultCode : successResultCode,
              message : successMessage,
              disableAppUsages : jsonResult
          });
      }, 3000)
  })
    .catch(() => {
        res.json("일치하는 정보가 없습니다.");
    })
  });
module.exports = router;
