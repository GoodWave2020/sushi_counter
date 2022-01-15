function doGet(e: any) {
  const template = HtmlService.createTemplateFromFile("index");
  template.message = false;
  return template.evaluate();
}

function doPost(e: any) {
  // 食べた寿司の数を取得
  const sushiCount = e.parameter.sushi_count;
  // 食べた人
  const person = e.parameter.person;
  // 入力用のスプレッドシートを取得
  const spreadsheet = SpreadsheetApp.openById(
    "1VlORWDOZSEEqw8YLcO-08Jn44-Y_YadBzHgEQhG5SjY"
  );
  // シートを選択
  const sheet = spreadsheet.getSheetByName("main");
  // 書き込み
  writeSushiCount(sushiCount, person, sheet);
  // 元の画面を表示
  const template = HtmlService.createTemplateFromFile("index");
  template.message = true;
  return template.evaluate();
}

function writeSushiCount(sushiCount: any, person: any, sheet: any) {
  // 最終行を取得
  const lastRow = sheet.getLastRow();
  // 今日の日付
  const today = new Date();
  let column = 0;
  let otherColumn = 0;
  let targetRow = 0;
  // 人によって書き込む列を決める。
  if (Number(person) === 0) {
    column = 2;
    otherColumn = 3;
  } else {
    column = 3;
    otherColumn = 2;
  }
  const lastRowCell = sheet.getRange(lastRow, column);
  const lastRowOtherCell = sheet.getRange(lastRow, otherColumn);
  if (!lastRowCell.isBlank() && !lastRowOtherCell.isBlank()) {
    targetRow = lastRow + 1;
  } else {
    targetRow = lastRow;
  }
  // 入力する行, 列
  const inputSushiCountCell = sheet.getRange(targetRow, column);
  // 今日の日付
  const inputDateCell = sheet.getRange(targetRow, 1);
  // 食べた寿司のデータの入力
  inputSushiCountCell.setValue(sushiCount);
  // 食べた日付の入力
  inputDateCell.setValue(today);
}
