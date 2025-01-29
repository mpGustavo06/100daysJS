// Função para codificar o texto usando LZW
function codificador(input) 
{
    let dictionary = {};
    let nextCode = 256; // Códigos de 0 a 255 são para caracteres individuais
    let currentString = "";
    let output = [];

    // Inicializa o dicionário com os caracteres ASCII
    for (let i = 0; i < 256; i++) 
    {
        dictionary[String.fromCharCode(i)] = i;
    }

    // Itera sobre cada caractere do texto de entrada
    for (let i = 0; i < input.length; i++) 
    {
        let char = input[i];
        let newString = currentString + char;

        // Verifica se a nova string ja existe no dicionário
        if (dictionary.hasOwnProperty(newString)) 
        {
            // Se sim, adiciona o código correspondente ao dicionário
            currentString = newString;
        } 
        else 
        {
            // Se nao, adiciona a nova string ao dicionário e adiciona o código correspondente
            output.push(dictionary[currentString]);
            dictionary[newString] = nextCode++;
            currentString = char;
        }
    }

    // Se ainda houver uma sequência atual não processada, adiciona seu código ao resultado
    if (currentString !== "") {
        output.push(dictionary[currentString]);
    }

    return output;
}

// Função para decodificar o texto usando LZW
function decodificador(input) 
{
    let dictionary = {};
    let nextCode = 256;
    let currentCode = input[0];
    let oldString = String.fromCharCode(currentCode);
    let output = oldString;

    // Inicializa o dicionário com os caracteres ASCII
    for (let i = 0; i < 256; i++) 
    {
        dictionary[i] = String.fromCharCode(i);
    }

    // Itera sobre cada código do texto de entrada
    for (let i = 1; i < input.length; i++) 
    {
        let newCode = input[i];
        let newString;

        // Verifica se o novo código ja existe no dicionário
        if (dictionary.hasOwnProperty(newCode)) 
        {
            newString = dictionary[newCode];
        } 
        // Se nao, verifica se o novo código e o próximo código do dicionário
        else if (newCode === nextCode) 
        {
            newString = oldString + oldString[0];
        } 
        // Se nao, lanca um erro
        else 
        {
            throw new Error("Código inválido");
        }

        output += newString;
        dictionary[nextCode++] = oldString + newString[0];
        oldString = newString;
    }

    return output;
}

// Adiciona um evento de clique ao botão "Codificar"
document.getElementById("codificadorButton").addEventListener("click", () => 
{
    // Pega o texto de entrada do usuário
    const inputText = document.getElementById("inputText").value;
    // Codifica o texto usando a função codificador
    const codificadorOutput = codificador(inputText);

    // Exibe o resultado codificado na tela (em formato JSON para facilitar a leitura)
    document.getElementById("codificadorOutput").textContent = JSON.stringify(codificadorOutput);
    // Limpa o resultado decodificado (se houver)
    document.getElementById("decodificadorOutput").textContent = "";
});

// Adiciona um evento de clique ao botão "Decodificar"
document.getElementById("decodificadorButton").addEventListener("click", () => 
{
    // Pega o resultado codificado exibido na tela
    const codificadorOutput = document.getElementById("codificadorOutput").textContent;

    // Verifica se há um resultado codificado para decodificar
    if (codificadorOutput) 
    {
        // Decodifica o resultado usando a função decodificador
        const decodificadorOutput = decodificador(JSON.parse(codificadorOutput));
        // Exibe o texto decodificado na tela
        document.getElementById("decodificadorOutput").textContent = decodificadorOutput;
    } 
    else 
    {
        // Se não houver resultado codificado, exibe um alerta para o usuário
        alert("Nenhum código codificado encontrado. Codifique um texto primeiro.");
    }
});