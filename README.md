# Slack Shop with GAS
Slackで購買を運営しよう！

## Description
Slack Shopとは，GASによって特定のグループ上で電子マネーシステムを構築し，slackのチャンネルにて商品の購入を可能とするシステムの総称です。  
本システムは以下の3つのGASスクリプトから構成されており，Slackインテグレーションを用いて連携が取られています。

-Slack_shop_add_command(https://github.com/zensai3805/Slack_shop_add_command)  
Slackの購買チャンネルに商品を追加するslash commandのスクリプトです。  
対象チャンネルには，ボタン付きの商品メッセージが追加されます。  

-Slask_shop_receiver(本スクリプト)  
Slackで商品メッセージに付いている購入ボタンを押すと，本スクリプトが起動し，購入者の残高を減らし，slackへ通知を行います。  

-Slask_shop_receiver(https://github.com/zensai3805/slack_shop_api)  
SpreadSheetに記述されたユーザーの残高情報やslackのID情報等を元に，取引処理や名前解決を行うAPIです。  

***DEMO:***

![Demo](https://camo.qiitausercontent.com/89f1c06c3154c3229be8e1c2f2b6f836eea82b44/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e616d617a6f6e6177732e636f6d2f302f3231313232352f30356530333736342d613461382d383631632d313132622d3634306634643538373162372e6a706567)

## Requirement

- Google AppScript
- SlackApp(GAS Library: https://qiita.com/soundTricker/items/43267609a870fc9c7453)

## Author

[@iwa0125](https://twitter.com/iwa0125)
