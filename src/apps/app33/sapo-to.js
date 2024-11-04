var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// DOM Elements
var dropZone = document.getElementById('dropZone');
var fileInput = document.getElementById('fileInput');
var widthInput = document.getElementById('width');
var heightInput = document.getElementById('height');
var maintainRatioCheckbox = document.getElementById('maintainRatio');
var percentageInput = document.getElementById('percentage');
var previewArea = document.getElementById('previewArea');
var resizeBtn = document.getElementById('resizeBtn');
var downloadAllBtn = document.getElementById('downloadAllBtn');
var presetButtons = document.getElementById('presetButtons');
var presetNameInput = document.getElementById('presetName');
var savePresetBtn = document.getElementById('savePreset');
// State
var uploadedImages = [];
var originalDimensions = {};
var resizedImages = {};
// Constants
var STORAGE_KEY = '8313resizetheimage';
// Utility Functions
function showNotification(message) {
    var notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(function () { return notification.classList.remove('show'); }, 3000);
}
function loadPresets() {
    var presets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    presetButtons.innerHTML = '';
    presets.forEach(function (preset) {
        var btn = document.createElement('button');
        btn.textContent = preset.name;
        btn.onclick = function () {
            widthInput.value = preset.width.toString();
            heightInput.value = preset.height.toString();
        };
        presetButtons.appendChild(btn);
    });
}
function savePreset() {
    var name = presetNameInput.value.trim();
    if (!name) {
        showNotification('プリセット名を入力してください');
        return;
    }
    var preset = {
        name: name,
        width: parseInt(widthInput.value),
        height: parseInt(heightInput.value)
    };
    var presets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    presets.push(preset);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    loadPresets();
    presetNameInput.value = '';
    showNotification('プリセットを保存しました');
}
function handleImageUpload(files) {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_1, _i, files_1, file;
        return __generator(this, function (_a) {
            uploadedImages = [];
            originalDimensions = {};
            resizedImages = {};
            previewArea.innerHTML = '';
            _loop_1 = function (file) {
                if (!file.type.startsWith('image/'))
                    return "continue";
                var reader = new FileReader();
                reader.onload = function (e) {
                    var _a, _b;
                    var img = new Image();
                    img.onload = function () {
                        originalDimensions[file.name] = {
                            width: img.width,
                            height: img.height
                        };
                        if (!widthInput.value) {
                            widthInput.value = img.width.toString();
                            heightInput.value = img.height.toString();
                        }
                    };
                    img.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                    uploadedImages.push({ file: file, preview: (_b = e.target) === null || _b === void 0 ? void 0 : _b.result });
                    updatePreview();
                };
                reader.readAsDataURL(file);
            };
            for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                file = files_1[_i];
                _loop_1(file);
            }
            downloadAllBtn.disabled = false;
            showNotification('画像をアップロードしました');
            return [2 /*return*/];
        });
    });
}
function updatePreview() {
    previewArea.innerHTML = '';
    uploadedImages.forEach(function (_a, index) {
        var preview = _a.preview;
        var card = document.createElement('div');
        card.className = 'preview-card';
        var img = document.createElement('img');
        img.src = preview;
        var info = document.createElement('p');
        var dimensions = originalDimensions[uploadedImages[index].file.name];
        info.textContent = "\u5143\u306E\u30B5\u30A4\u30BA: ".concat(dimensions === null || dimensions === void 0 ? void 0 : dimensions.width, "x").concat(dimensions === null || dimensions === void 0 ? void 0 : dimensions.height, "px");
        card.appendChild(img);
        card.appendChild(info);
        previewArea.appendChild(card);
    });
}
function resizeImages() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var usePercentage, percentage, _loop_2, _i, uploadedImages_1, _b, file, preview;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (uploadedImages.length === 0) {
                        showNotification('画像をアップロードしてください');
                        return [2 /*return*/];
                    }
                    usePercentage = (_a = document.querySelector('input[name="resizeType"][value="percentage"]')) === null || _a === void 0 ? void 0 : _a.checked;
                    percentage = parseInt(percentageInput.value) / 100;
                    _loop_2 = function (file, preview) {
                        var img;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    img = new Image();
                                    img.src = preview;
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            img.onload = function () {
                                                var newWidth, newHeight;
                                                if (usePercentage) {
                                                    newWidth = Math.round(img.width * percentage);
                                                    newHeight = Math.round(img.height * percentage);
                                                }
                                                else {
                                                    newWidth = parseInt(widthInput.value);
                                                    newHeight = parseInt(heightInput.value);
                                                }
                                                var canvas = document.createElement('canvas');
                                                canvas.width = newWidth;
                                                canvas.height = newHeight;
                                                var ctx = canvas.getContext('2d');
                                                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                                                resizedImages[file.name] = canvas.toDataURL(file.type);
                                                resolve();
                                            };
                                        })];
                                case 1:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, uploadedImages_1 = uploadedImages;
                    _c.label = 1;
                case 1:
                    if (!(_i < uploadedImages_1.length)) return [3 /*break*/, 4];
                    _b = uploadedImages_1[_i], file = _b.file, preview = _b.preview;
                    return [5 /*yield**/, _loop_2(file, preview)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    updatePreviewWithResized();
                    showNotification('リサイズが完了しました');
                    return [2 /*return*/];
            }
        });
    });
}
function updatePreviewWithResized() {
    previewArea.innerHTML = '';
    Object.entries(resizedImages).forEach(function (_a) {
        var filename = _a[0], dataUrl = _a[1];
        var card = document.createElement('div');
        card.className = 'preview-card';
        var img = document.createElement('img');
        img.src = dataUrl;
        var downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'ダウンロード';
        downloadBtn.onclick = function () { return downloadImage(filename, dataUrl); };
        card.appendChild(img);
        card.appendChild(downloadBtn);
        previewArea.appendChild(card);
    });
}
function downloadImage(filename, dataUrl) {
    var link = document.createElement('a');
    link.download = "8313resize".concat(filename);
    link.href = dataUrl;
    link.click();
}
function downloadAllImages() {
    Object.entries(resizedImages).forEach(function (_a) {
        var filename = _a[0], dataUrl = _a[1];
        downloadImage(filename, dataUrl);
    });
    showNotification('一括ダウンロードを開始しました');
}
// Event Listeners
dropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', function () {
    dropZone.classList.remove('drag-over');
});
dropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    handleImageUpload(e.dataTransfer.files);
});
dropZone.addEventListener('click', function () {
    fileInput.click();
});
fileInput.addEventListener('change', function () {
    if (fileInput.files) {
        handleImageUpload(fileInput.files);
    }
});
document.querySelectorAll('input[name="resizeType"]').forEach(function (radio) {
    radio.addEventListener('change', function (e) {
        var usePercentage = e.target.value === 'percentage';
        document.querySelector('.dimensions-inputs').style.display = usePercentage ? 'none' : 'block';
        document.querySelector('.percentage-input').style.display = usePercentage ? 'block' : 'none';
    });
});
widthInput.addEventListener('input', function () {
    if (maintainRatioCheckbox.checked && uploadedImages.length > 0) {
        var dimensions = originalDimensions[uploadedImages[0].file.name];
        var ratio = dimensions.height / dimensions.width;
        heightInput.value = Math.round(parseInt(widthInput.value) * ratio).toString();
    }
});
heightInput.addEventListener('input', function () {
    if (maintainRatioCheckbox.checked && uploadedImages.length > 0) {
        var dimensions = originalDimensions[uploadedImages[0].file.name];
        var ratio = dimensions.width / dimensions.height;
        widthInput.value = Math.round(parseInt(heightInput.value) * ratio).toString();
    }
});
resizeBtn.addEventListener('click', resizeImages);
downloadAllBtn.addEventListener('click', downloadAllImages);
savePresetBtn.addEventListener('click', savePreset);
// Initialize
loadPresets();
