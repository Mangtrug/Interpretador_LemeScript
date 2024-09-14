// ./scripts/transpiler.js

export class Transpiler {
    constructor(editor, output) {
        this.editor = editor;
        this.output = output;
        this.intervalId = null;
    }

    translate(code) {
        // Substitui as palavras-chave de LemeScript por JavaScript
        let transpiledCode = code
            .replace(/se\s+(.*?)\s+{/g, 'if ($1) {')
            .replace(/entao/g, '')
            .replace(/fim/g, '}')
            .replace(/log/g, 'console.log')
            .replace(/entrada/g, 'prompt');

        return transpiledCode;
    }

    run() {
        if (this.intervalId !== null) {
            // Já está executando, não inicie outro intervalo
            return;
        }

        const code = this.editor.getValue();
        const jsCode = this.translate(code);

        // Captura a saída de console.log
        const originalConsoleLog = console.log;
        console.log = (...args) => {
            this.output.textContent += args.join(' ') + '\n';
        };

        // Limpa o conteúdo de saída antes de executar o novo código
        this.output.textContent = '';

        // Executa o código em intervalos regulares
        this.intervalId = setInterval(() => {
            try {
                eval(jsCode);
                // Código executado, parar o intervalo
                clearInterval(this.intervalId);
                this.intervalId = null;
                // Restaura o console.log original
                console.log = originalConsoleLog;
            } catch (error) {
                this.output.textContent = `Erro: ${error.message}`;
                clearInterval(this.intervalId);
                this.intervalId = null;
                // Restaura o console.log original
                console.log = originalConsoleLog;
            }
        }, 0); // Executa o código imediatamente
    }

    stop() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.output.textContent = 'Execução parada';
        }
    }
}
