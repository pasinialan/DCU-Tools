// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cp = require('child_process');
const APP_KEY = vscode.workspace.getConfiguration('dcu-tools').appKey;
const ENVIRONMENT = vscode.workspace.getConfiguration('dcu-tools').environment;

const formatPath = (widgetPath) => {
    if (widgetPath.startsWith("/")) {
        widgetPath = widgetPath.replace("/", "");
    }
    return widgetPath;
};

const validateDCU = () => 
    new Promise ((resolve, reject) => {
        executeShell("dcu --version").then((data) => {
            return resolve(true);
        }, (err) => {
            return reject(false);
        });
    });

const checkParams = (...params) => {
    for (let i in params) {
        if (!params[i])
            return false;
    }
    return true;
};

const executeShell = (cmd, rootDir) =>
    new Promise ((resolve, reject) => {
        cp.exec("set NODE_TLS_REJECT_UNAUTHORIZED=0");
        cp.exec(cmd, {
            cwd: rootDir
        }, (err, out) => {
            if (err)
                return reject(err);

            return resolve(out);
        });
        
    });

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "dcu-tools" is now active!');

    let _checkParams = checkParams(APP_KEY, ENVIRONMENT);
    if (!_checkParams) {
        vscode.window.showErrorMessage("It is not possible to find some configuration variables. Check values in File > Preferences > Settings > Extensions > DCU Tools.");
    }
    
    let getAllContents = vscode.commands.registerCommand('dcu-tools.getAllContents', function (uri) {
        
        validateDCU().then(data => {
            let folderPath = vscode.workspace.rootPath; // get the open folder path

            executeShell('dcu --grab --clean --allLocales --node ' + ENVIRONMENT + ' --applicationKey ' + APP_KEY, folderPath).then((cmd1) => {
                vscode.window.showInformationMessage('Get all contents with success!');
            }, function(err) {
                vscode.window.showErrorMessage('Error On Get all contents!', err);
            });		
        }, (err) => {
            console.error('[data err]', err);
            vscode.window.showErrorMessage("DCU error, please try to reinstall your DCU extension.");
        });
    });

    let getAllWidgets = vscode.commands.registerCommand('dcu-tools.getAllWidgets', function (uri) {
        
        validateDCU().then(data => {
            let folderPath = vscode.workspace.rootPath; // get the open folder path
            let widgetPath = formatPath(folderPath);
            widgetPath = `${widgetPath}\\widget`;

            executeShell('dcu --refresh "' + widgetPath + '" ' + ENVIRONMENT + ' --applicationKey ' + APP_KEY, folderPath).then((cmd1) => {
                vscode.window.showInformationMessage('Get all widgets with success!');
            }, function(err) {
                vscode.window.showErrorMessage('Error On Get all widgets!', err);
            });		
        }, (err) => {
            console.error('[data err]', err);
            vscode.window.showErrorMessage("DCU error, please try to reinstall your DCU extension.");
        });
    });

	let refreshWidget = vscode.commands.registerCommand('dcu-tools.refreshWidget', function (uri) {
        
        validateDCU().then(data => {
            let folderPath = vscode.workspace.rootPath; // get the open folder path
            let widgetPath = formatPath(uri.path);

            executeShell('dcu --refresh "' + widgetPath + '" ' + ENVIRONMENT + ' --applicationKey ' + APP_KEY, folderPath).then((cmd1) => {
                vscode.window.showInformationMessage('Refresh Widget success!');
            }, function(err) {
                console.error('[data err]', err);
                vscode.window.showErrorMessage('Error On Refresh Widget. Try to delete all files inside the widget folder and rerun a refresh widget script.');
            });		
        }, (err) => {
            console.error('[data err]', err);
            vscode.window.showErrorMessage("DCU error, please try to reinstall your DCU extension.");
        });
    });

    let getGlobals = vscode.commands.registerCommand('dcu-tools.getGlobals', function (uri) {
        
        validateDCU().then(data => {
            let folderPath = vscode.workspace.rootPath; // get the open folder path
            let widgetPath = formatPath(folderPath);
            widgetPath = `${widgetPath}\\global`;

            executeShell('dcu --refresh "' + widgetPath + '" ' + ENVIRONMENT + ' --applicationKey ' + APP_KEY, folderPath).then((cmd1) => {
                vscode.window.showInformationMessage('Refresh globals with success!');
            }, function(err) {
                vscode.window.showErrorMessage('Error On Refresh globals!', err);
            });		
        }, (err) => {
            console.error('[data err]', err);
            vscode.window.showErrorMessage("DCU error, please try to reinstall your DCU extension.");
        });
    });

    let getTheme = vscode.commands.registerCommand('dcu-tools.getTheme', function (uri) {
        
        validateDCU().then(data => {
            let folderPath = vscode.workspace.rootPath; // get the open folder path
            let widgetPath = formatPath(folderPath);
            widgetPath = `${widgetPath}\\theme`;

            executeShell('dcu --refresh "' + widgetPath + '" ' + ENVIRONMENT + ' --applicationKey ' + APP_KEY, folderPath).then((cmd1) => {
                vscode.window.showInformationMessage('Refresh themes with success!');
            }, function(err) {
                vscode.window.showErrorMessage('Error On Refresh themes!', err);
            });		
        }, (err) => {
            console.error('[data err]', err);
            vscode.window.showErrorMessage("DCU error, please try to reinstall your DCU extension.");
        });
    });

    let updatePath = vscode.commands.registerCommand('dcu-tools.updatePath', function (uri) {
		validateDCU().then(data => {
            let folderPath = vscode.workspace.rootPath; // get the open folder path
            let widgetPath = formatPath(uri.path);

            executeShell('dcu --putAll "' + widgetPath + '" --applicationKey ' + APP_KEY, folderPath).then((cmd1) => {
                vscode.window.showInformationMessage('Update File success!');
            }, function(err) {
                vscode.window.showErrorMessage('Error On Update File!', err);
            });	
        }, (err) => {
            console.error('[data err]', err);
            vscode.window.showErrorMessage("DCU error, please try to reinstall your DCU extension.");
        });
	});
    
    let updateFile = vscode.commands.registerCommand('dcu-tools.updateFile', function (uri) {
		validateDCU().then(data => {
            let folderPath = vscode.workspace.rootPath; // get the open folder path
            let widgetPath = formatPath(uri.path);

            executeShell('dcu --put "' + widgetPath + '" --applicationKey ' + APP_KEY, folderPath).then((cmd1) => {
                vscode.window.showInformationMessage('Update File success!');
            }, function(err) {
                vscode.window.showErrorMessage('Error On Update File!', err);
            });	
        }, (err) => {
            console.error('[data err]', err);
            vscode.window.showErrorMessage("DCU error, please try to reinstall your DCU extension.");
        });
	});

    context.subscriptions.push(getAllContents);
    context.subscriptions.push(getAllWidgets);
    context.subscriptions.push(refreshWidget);
    context.subscriptions.push(getGlobals);
    context.subscriptions.push(getTheme);
    context.subscriptions.push(updatePath);
    context.subscriptions.push(updateFile);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
