// ダイアログのスタイルを設定
function setupDialogStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .ql-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1A1F2C;
            color: #FFFFFF;
            padding: 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
            z-index: 9999;
            min-width: 320px;
            max-width: 90%;
        }
        .ql-dialog input {
            width: 100%;
            padding: 0.5rem 0.75rem;
            margin: 0.5rem 0;
            border: 1px solid #403E43;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            background: #2A2F3C;
            color: #FFFFFF;
            transition: border-color 0.15s ease-in-out;
        }
        .ql-dialog input:focus {
            outline: none;
            border-color: #9b87f5;
            box-shadow: 0 0 0 1px rgba(155, 135, 245, 0.2);
        }
        .ql-dialog-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1rem;
        }
        .ql-dialog-button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
        }
        .ql-dialog-button.primary {
            background: #9b87f5;
            color: white;
        }
        .ql-dialog-button.primary:hover {
            background: #7E69AB;
        }
        .ql-dialog-button.secondary {
            background: #403E43;
            color: #FFFFFF;
        }
        .ql-dialog-button.secondary:hover {
            background: #2A2F3C;
        }
        .ql-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            z-index: 9998;
        }
        .ql-dialog svg {
            fill: #FFFFFF;
            stroke: #FFFFFF;
        }
        .ql-dialog h3 {
            color: #FFFFFF;
            margin-bottom: 1rem;
        }
        .ql-dialog p {
            color: #C8C8C9;
        }
    `;
    document.head.appendChild(styleSheet);
}