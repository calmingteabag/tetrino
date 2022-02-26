# Bem vindo ao Tetrino, um clone do famoso tetris.

Assim como o Pentaword (a versão caseira do Wordle/Letreco), a idéia não é seguir tutoriais de "como fazer X" mas sim tentar construir o tetris partindo do zero ou no máximo com algumas noções bem gerais do jogo. Esse readme, além do historico dos commits, serve para registrar os dias de sofrimento e gloria até esse projeto sair.

## Dia 1

Terminei o design basico do jogo. Como nos projetos anteriores eu sempre pensava em desktop primeiro pra depois pensar em mobile, resolvi fazer o contrario e ir direto pra mobile. Como resultado, o design pra mobile ficou aceitavel, mas para desktop ficou meio estranho. Arrumo depois se precisar

## Dia 2

Comecei a mexer com a funcionalidade do jogo e depois de bater a cabeça um pouco, como de costume, a base de movimentação das peças saiu. Ainda ficaram algumas coisas para resolver, mas a principal delas é o canvas que no caso de um jogo tipo tetris, não pode ter tamanho variável como eu fiz (acompanhando o tamanho do div, para ficar bonito). A ideia que pensei foi, "se quero que o 'tabuleiro' tenha 10 x 20 quadradinhos, é só dividir o tamanho do canvas por 10 e andar esse tanto". Maravilha, pensei. Só que não. 

O problema é que a divisão retorna um float (ex, width de 532 / 10 pixels) e a coisa desanda com as peças terminando em posições erradas (por exemplo, passando do fim do tabuleiro). Minha outra ideia brilhante foi usar arredondamento, que foi basicamente trocar seis por meia duzia. 

## Dia 3

Arrumei a parte da movimentação das peças e descobri que, se faço o tamanho do canvas pelo css e não pelo atributo do html, ele desaranja tudo (pois flexbox). Acabei fazendo um canvas de tamanho fixo no html que deixou layout feio, mas por outro lado facilitou a parte da lógica do jogo. Agora que só tenho que lidar com valores cheios e não proporções.

Outra coisa, imaginando que o jogo é um tabuleiro de x colunas por y linhas, uma hora ele vai precisar saber o que tem em cada uma das 'células' (imagine uma tabela excel), pra efeito de colisão ou algo nesse sentido. Então criei uma array 2D com todas as 'celulas' e pra cada celula um objeto que vai guardar informação sobre a ela (coordenadas, se ocupada ou não, etc). Assim o jogo pode acessar o que tem na celula usando simples coordenadas, do tipo tabuleiro[0][2]. 

## Dia 4

Separei a parte de movimentação das peças da parte visual, porque, bem, caos. Agora quando se dá o comando de mover as peças, o jogo faz update das coordendas da board para depois ler o conteudo da celula e desenhar a peça. Ficou infinitamente mais organizado
desse jeito e mais facil de fazer as coisas, principalmente colisão que é algo importante no tetris (ou qualquer jogo que não seja texto). 

A checagem de movimento está bem simples, ele só olha se a peça chegou nos cantos da board mas preciso colcar uma checagem para ver se a posição pra onde quero mexer é valida antes de deixar mexer.

## Dia 5

Dia de dar com os burros na água. Spawn de peças funciona quando se chama elas manualmente no document.addEventListener, mas não consigo fazer a função de gerar uma peça randomicamente ler direito a função de constuir a peça na tela. Tentei várias formas, usando map/object com a chave retornando a função, mas descobri que em javascript ele retorna undefined.  Tambem tentei uma lista com os nomes das funções e depois tentando algo do tipo nomes[posição](parametros), ele chama a função da peça (que usa uma outra função) e essa retorna "Cannot read properties of undefined (reading 'tetrinoBaseShape')". What the hell.

## Dia 6

Invés de bater a cabeça mudei o metodo. Agora ao contrario de ter um metodo base e os outros metodos irem criando os tetrinos invocando esse metodo várias vezes, cada peça já é desenhada direto usando lineTo(). O spawn de peças funciona como deveria, sem as dores de cabeça de ontem sumiram, oh maravilha. Próximo passo é, o jogador mexer a peça que spawnar, porque o jogo spawna uma e mexe a peça padrão.