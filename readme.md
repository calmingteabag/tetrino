# Bem vindo ao Tetrino, um clone do famoso tetris.

Assim como o Pentaword (a versão caseira do Wordle/Letreco), a idéia não é seguir tutoriais de "como fazer X" mas sim tentar construir o tetris partindo do zero ou no máximo com algumas noções bem gerais do jogo. Esse readme, além do historico dos commits, serve para registrar os dias de sofrimento e gloria até esse projeto sair.

### Dia 1

Terminei o design basico do jogo. Como nos projetos anteriores eu sempre pensava em desktop primeiro pra depois pensar em mobile, resolvi fazer o contrario e ir direto pra mobile. Como resultado, o design pra mobile ficou aceitavel, mas para desktop ficou meio estranho. Arrumo depois se precisar

### Dia 2

Comecei a mexer com a funcionalidade do jogo e depois de bater a cabeça um pouco, como de costume, a base de movimentação das peças saiu. Ainda ficaram algumas coisas para resolver, mas a principal delas é o canvas que no caso de um jogo tipo tetris, não pode ter tamanho variável como eu fiz (acompanhando o tamanho do div, para ficar bonito). A ideia que pensei foi, "se quero que o 'tabuleiro' tenha 10 x 20 quadradinhos, é só dividir o tamanho do canvas por 10 e andar esse tanto". Maravilha, pensei. Só que não. 

O problema é que a divisão retorna um float (ex, width de 532 / 10 pixels) e a coisa desanda com as peças terminando em posições erradas (por exemplo, passando do fim do tabuleiro). Minha outra ideia brilhante foi usar arredondamento, que foi basicamente trocar seis por meia duzia. 

### Dia 3

Arrumei a parte da movimentação das peças e descobri que, se faço o tamanho do canvas pelo css e não pelo atributo do html, ele desaranja tudo (pois flexbox). Acabei fazendo um canvas de tamanho fixo no html que deixou layout feio, mas por outro lado facilitou a parte da lógica do jogo. Agora que só tenho que lidar com valores cheios e não proporções.

Outra coisa, imaginando que o jogo é um tabuleiro de x colunas por y linhas, uma hora ele vai precisar saber o que tem em cada uma das 'células' (imagine uma tabela excel), pra efeito de colisão ou algo nesse sentido. Então criei uma array 2D com todas as 'celulas' e pra cada celula um objeto que vai guardar informação sobre a ela (coordenadas, se ocupada ou não, etc). Assim o jogo pode acessar o que tem na celula usando simples coordenadas, do tipo tabuleiro[0][2]. 

### Dia 4

Separei a parte de movimentação das peças da parte visual, porque, bem, caos. Agora quando se dá o comando de mover as peças, o jogo faz update das coordendas da board para depois ler o conteudo da celula e desenhar a peça. Ficou infinitamente mais organizado
desse jeito e mais facil de fazer as coisas, principalmente colisão que é algo importante no tetris (ou qualquer jogo que não seja texto). 

A checagem de movimento está bem simples, ele só olha se a peça chegou nos cantos da board mas preciso colcar uma checagem para ver se a posição pra onde quero mexer é valida antes de deixar mexer.

### Dia 5

Dia de dar com os burros na água. Spawn de peças funciona quando se chama elas manualmente no document.addEventListener, mas não consigo fazer a função de gerar uma peça randomicamente ler direito a função de constuir a peça na tela. Tentei várias formas, usando map/object com a chave retornando a função, mas descobri que em javascript ele retorna undefined.  Tambem tentei uma lista com os nomes das funções e depois tentando algo do tipo nomes[posição](parametros), ele chama a função da peça (que usa uma outra função) e essa retorna "Cannot read properties of undefined (reading 'tetrinoBaseShape')". What the hell.

### Dia 6

Invés de bater a cabeça mudei o metodo. Agora ao contrario de ter um metodo base e os outros metodos irem criando os tetrinos invocando esse metodo várias vezes, cada peça já é desenhada direto usando lineTo(). O spawn de peças funciona como deveria, e as dores de cabeça de ontem sumiram, oh maravilha. Próximo passo é, o jogador mexer a peça que spawnar, porque o jogo spawna uma e mexe a peça padrão.

### Dia 7

E as coisas progrediram um pouco. Consegui visualizar como fazer o sistema de checar colisões, que estava me tirando o sono. Agora quando cada peça é gerada, junto com ela tambem vem as coordenadas em uma array, que são as que ela ocupa no canvas. Essas coordenadas são relativas, porque a peça precisa se mover no tabuleiro. A parte de colisão ficou amanhã, mas envolve olhar pra qual direção ela quer ir e fazer um loop nessas coordenadas, e ver se a posição que se quer ir + 1 é valida ou não. 

### Dia 8

Depois de uma pausa de carnaval, voltemos ao projeto. Não mencionei nos dias anteriores mas teve uma mudança até que grande no modo como o programa vê o jogo. O modo como eu fazia pra mover as peças e parecer que elas estão em um tabuleiro era incrementar a distancia que a peça ia ser desenhada em X, e esse X seria o tamanho do quadradinho (pense em um tabuleiro de xadrês). Funciona no questio mover, mas deixava a parte de colisões quase impossível, fora outros problemas, por exemplo, saber se o próximo espaço é valido pra mover ou não.

De volta ao modo pesquisa, achei um video de uma pessoa que separa a parte de desenho das peças no canvas da lógica. Ele cria uma array 2x2 representando o tabuleiro e em cada array uma coordenada, representando onde o desenho tem que começar naquela celula. Cada tetrino tem um sistema de coordenadas próprio. Não entendi o proposito vendo, mas entendi na hora de implementar: Você tem um tetrino "I" que começa no [0][0] da array e está na posição horizontal. Então ele ocupa as coordenadas [0][0],[1][0],[2][0],[3][0]
Ok, a array sabe onde ele está, mas como ele sabe onde desenhar? O jogo pega a coordenada [0][0] e olha as coordenadas onde ele tem que usar como base pra desenhar algo e faz o desenho no canvas. E assim com todas as coordenadas até desenhar o tetrino.

E como as peças se movem? Simplesmente fazendo update da posição da array. Exemplo, se você tem algo na coordenada [x][y] da array e quer mover as coisas para direita, é só incrementar o x em 1.

### Dia 9 

O esquema de rodar as peças começou a virar uma linguiça gigantesca com esse esquema de ficar passando as coordenadas pra lá e pra cá. Amanhã implemento, mas pensei numa forma melhor, que é o programa passar um loop nas coordenadas, olhar cada coordenada na array e ir desenhando cada qudradinho onde precisa, ao invés de ter uma função pra cada formato de peça.

### Dia 10

O esquema de desenhar os tetrinos por loop funcionou bem, mas depois de dar uma olhada no codigo, ficaram várias linguiças para trás.

Primeiro deles era que as coordenadas da uma peça eram pensadas para ela ser gerada na horizontal, mas o jogo gerava na vertical o que por si só já deixa as coisas bem caoticas. Segundo é que fiquei um tempo absurdo com a idéia de plano cartesiano de escola na cabeça na hora de mover. O que acontecia então era que eu pensava "se eu aperto a tecla para subir, a peça mexe no eixo Y, então tenho que fazer esse valor mudar". Só que, quando se pensa em mover coisas em um tabuleiro [X_linhas][Y_colunas], o Y muda as colunas, ou seja, ao invés da peça andar para cima ou para baixo, ela anda para os lados.

O esquema de rotacionar as peças, se tudo der certo e eu não linguiçar nada, vai usar um sistema de coordenadas de transformação. A coordenada da peça na posição atual entra, o programa soma com as coordenadas de transformação baseadas na posição que ela vai girar e ele desenha a peça na nova posição.

### Dia 11

Comecei a trabalhar mais no jogo em si depois de terminar o spawn de peças. Por enquanto, quando a pela chega no fim do canvas, ou seja, no fim da array, o jogo marca as coordenadas da ultima posição como ocupadas, chama a função de limpar o canvas e spawna outra array. Essa função de limpar foi modificada - Antes ela limpava o canvas inteiro, agora, só as posições que não estão ocupadas.

Agora preciso arrumar as colisões para as peças não sobreporem umas as outras.

### Dia 12

Depois de um tempo torrando um pouco a cabeça, finalizei finalmente o esquema para as peças irem se acumulando na tela a medida que elas encostam no fim do canvas ou em cima de alguma peça. Tambem arrumei o metodo que fazia as peças rodarem que estava no modo linguiça, ou seja, com vários if-elses.

O que preciso fazer agora é uma condicional pra ver se a peça está na primeira coluna ou na última antes de rodar, porque elas retornam erro quando tentam girar nessas posições (a lógica do jogo foi feita para funcionar na área da array, afinal.)

### Dia 13

Terminei, em partes a rotação. Ela funciona como deveria, mas a forma como ficou o codigo deixou ele meio lingucento, principalmente a parte de checagem de rotação, com uma tonelada de for loops. Absolutamente gambiarra, que preciso ver como corrigir. Em outras noticias, o jogo parece funcionar bem, 'só' ficou faltando a parte do jogo marcar as linhas cheias, deletar o que existe e puxar o resto das peças para baixo, e o esquema para as peças 'cairem' pela board.

### Dia 14

Depois de um teste rapido, descobri que a rotação não funciona como deveria, as peças estavam clipando coisas que não deveriam. Passei o dia rachando o cerebro, para variar, entre resolver o problema e dar um jeito na linguiça de codigo. A linguiça deixou de ser linguiça mas ainda é uma salsisha. A parte de rotação é o que me tira o sono, mas pelo menos consegui resolver alguns problemas de clipping, restou checar os limites (peças encostando nas bordas).

### Dia 15

Dei uma pausa no esquema de rotação das peças porque ela está me dando uma dor de cabeça de proporções épicas. O grande "problema" do tetris é que ela não permite rodar em certas situações, mas permite em outras, que faz as coisas ficarem bem chatinhas. Ele ainda falha na hora de rodar a peça quando ela está encostada no lado direito do canvas, por algum motivo que não entendo ainda.

Resolvi trabalhar na parte que faz as peças cairem automaticamente e foi relativamente tranquilo. Agora sim, ver as peças caindo faz o jogo se parecer com tetris.

Proximo passo, que eu acho que vai me dar dor de cabeça igual a rotação, é o esquema do jogo ler quando se completa uma linha com os quadrados, o jogo deletar a linha e empurrar todas as peças para baixo. Única coisa que tenho agora é uma vaga noção de como fazer.

### Dia 16

Consegui planejar e implementar a parte que faz o jogo deletar as linhas quando elas ficam cheias. Está bem longe de ser o modo mais eficiente do mundo, mas em se tratando de tetris e não um jogo open world 3D, ele cumpre a função. Tambem já consegui visualizar o esquema do jogo mover as peças todas para baixo, que vou tentar implementar amanhã.

### Dia 20

Pulei alguns dias porque resolvi tentar mudar o programa, dividindo as coisas em arquivos separados para ficar melhor organizado que um arquivão unico e enorme de 600+ linhas. Aprendi batendo a cabeça que quando um metodo ou função tem que ler algo de outra função, esse 'algo' é somente leitura. Li que existem meios para conseguir modificar, mas achei melhor mudar algumas coisas, por exemplo, passar alguns this.atributo para localStorage, assim ele fica acessivel 'globalmente'. Outra maneira era simplesmente usar variáveis globais, que não é recomendado.

### Dia 23

Finalmente consegui terminar toda funcionalidade do jogo. Pense num trampo. Mas está feito, e agora o jogo está lindo (está feio, mas lindo na parte de programação). Preciso agora terminar a parte de refatoração e arrumar alguns bugs chatos. No mais, nem acredito que cheguei até aqui...

### Dia 29

Após pausa de alguns dias, retomei os trabalhos e avancei bastante na parte de refatoração. O que me incomodava, além do fato de ter um programa de 600+ linhas em um arquivo só ser "indebugavel", era que eu passava o valor das variáveis direto nas funções/métodos ao invés de usar parametros quando se chama a função. O jogo funciona mas, por exemplo, se eu decido que preciso mudar o tamanho de algo, esse algo tem que ser mudado em todos os lugares, deixando o debug insanamente dificil.

No mais, terminei a parte bruta da pontuação. Nada super complexo, só um sistema que conta a pontuação conforme as linhas são limpas e outro para contar quantas delas foram limpas.

### Dia 30

Trabalhando no score, percebi que não se pode subestimar as coisas. Achei que seria facil incrementar o 'level' do jogo conforme a quantidade de linhas preenchidas, mas ta sendo mais trabalhoso que imaginei. 