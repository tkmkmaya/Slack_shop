# Slack Shop with GAS
Slackで購買を運営しよう！

## Description
Slack Shopとは，GASによって特定のグループ上で電子マネーシステムを構築し，slackのチャンネルにて商品の購入を可能とするシステムの総称です。  
本システムは以下の4つのGASスクリプトから構成されており，Slackインテグレーションを用いて連携が取られています。

- Slask_shop_receiver(本スクリプト)  
  - Slackの購買チャンネルで購入ボタンを押すことで呼び出され、入出金ライブラリを呼び出し処理を行います。

- Slack_shop_add_command[[gihHub link]](https://github.com/zensai3805/Slack_shop_add_command)  
  - Slackの購買チャンネルに商品を追加するslash commandのスクリプトです。購買チャンネルには，ボタン付きの商品メッセージが追加されます。  
  
- Slack_shop_input_webui[[gitHub link]](https://github.com/zensai3805/Slack_shop_Input_webui)
  - 入金を行うためのWebUIです。GASにて公開したURLをブラウザにて開くことで、入金のためのUIが表示されます。研究室での利用のため、入金は信用ということで、iPadをお金を入れる箱の横において本WebUIを利用させています。

- Slask_shop_api[[gitHub link]](https://github.com/zensai3805/slack_shop_api)  
  - SpreadSheetに記述されたユーザーの残高情報やslackのID情報等を元に，取引処理や名前解決を行うAPIです。  

***DEMO:***

![Demo](https://camo.qiitausercontent.com/972377a27e2655cfb6f40398fed17644e9cb79da/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e616d617a6f6e6177732e636f6d2f302f3231313232352f35353032613937642d346364382d616261322d346339612d3731373761393133383438312e706e67)

## Requirement

- Google AppScript

### Required GAS Library
- SlackApp
  - Qiita記事: [https://qiita.com/soundTricker/items/43267609a870fc9c7453](https://qiita.com/soundTricker/items/43267609a870fc9c7453)
  - Library ID: M3W5Ut3Q39AaIwLquryEPMwV62A3znfOO

## Author

[@iwa0125](https://twitter.com/iwa0125)
