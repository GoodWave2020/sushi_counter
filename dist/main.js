var SUSHI_ROW = {
    akami: 2,
    shiromi: 3,
    hikari: 4,
    nimono: 5,
    shell: 6,
    uni: 7,
    ikura: 8
};
function doGet(e) {
    var template = HtmlService.createTemplateFromFile("index");
    template.message = false;
    return template.evaluate();
}
function doPost(e) {
    // 入力用のスプレッドシートを取得
    var spreadsheet = SpreadsheetApp.openById("1VlORWDOZSEEqw8YLcO-08Jn44-Y_YadBzHgEQhG5SjY");
    // 書き込み
    writeSushiCount(e.parameter, spreadsheet);
    // 元の画面を表示
    var template = HtmlService.createTemplateFromFile("index");
    template.message = true;
    return template.evaluate();
}
function writeSushiCount(parameter, spreadsheet) {
    var today = new Date(); // 今日の日付
    var formattedToday = Utilities.formatDate(today, "JST", "yyyy/MM/dd"); // 日付を文字列に変換
    var sheets = myAllSheetName(spreadsheet); // シート名を取得
    // 今日の日付のシート名があるかチェックする。
    if (!checkNeedToMakeSheet(sheets, formattedToday)) {
        // 無ければシートを作る。
        addSheet(spreadsheet, formattedToday);
    }
    // シートを取得する。
    var sheet = spreadsheet.getSheetByName(formattedToday);
    var column = 0;
    // 人によって書き込む列を決める。
    if (Number(parameter.person) === 0) {
        // おまみ
        column = 2;
    }
    else {
        // ばぼちぇ
        column = 3;
    }
    Object.keys(SUSHI_ROW).forEach(function (key) {
        // 入力する行, 列
        var inputSushiCountCell = sheet === null || sheet === void 0 ? void 0 : sheet.getRange(SUSHI_ROW[key], column);
        // 食べた寿司のデータの入力
        inputSushiCountCell === null || inputSushiCountCell === void 0 ? void 0 : inputSushiCountCell.setValue(parameter[key]);
    });
}
function addSheet(spreadsheet, today) {
    var copySheet = spreadsheet.getSheetByName("ソースシート");
    var newCopySheet = copySheet === null || copySheet === void 0 ? void 0 : copySheet.copyTo(spreadsheet);
    newCopySheet === null || newCopySheet === void 0 ? void 0 : newCopySheet.setName(today);
}
function myAllSheetName(spreadsheet) {
    var sheets = spreadsheet.getSheets();
    return sheets.map(function (sheet) { return sheet.getName(); });
}
function checkNeedToMakeSheet(sheets, today) {
    return sheets.includes(today);
}
