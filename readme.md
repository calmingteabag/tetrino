# Bem vindo ao Tetrino, um clone do famoso tetris.

Assim como o Pentaword (a versão caseira do Wordle/Letreco), a idéia não é seguir tutoriais de "como fazer X" mas sim tentar construir o tetris partindo do zero ou no máximo com algumas noções bem gerais do jogo. Esse readme, além do historico dos commits, serve para registrar os dias de sofrimento e gloria até esse projeto sair.

# Dia 1

Terminei o design basico do jogo. Como nos projetos anteriores eu sempre pensava em desktop primeiro pra depois pensar em mobile, resolvi fazer o contrario e ir direto pra mobile. Como resultado o design pra mobile ficou aceitavel, mas pra desktop ficou meio estranho, mas depois ajusto se precisar.

# Dia 2

Comecei a mexer com a funcionalidade do jogo e depois de bater a cabeça um pouco como de costume, a base de movimentação das peças saiu. Ainda ficaram algumas coisas para resolver, mas a principal delas é o canvas que no caso de um jogo tipo tetris, não pode ter
tamanho variável como eu fiz (acompanhando o tamanho do div, pra ficar bonito). A ideia que pensei foi, se quero que o 'tabuleiro' 
tenha 10 x 20 quadradinhos, é só dividir o tamanho do canvas por 10 e andar esse tanto, maravilha. So que não. 

O problema é que a divisão retorna um float (ex, width de 532 / 10 pixels) e a coisa desanda com as peças terminando em posições erradas (por ex, passando do fim do tabuleiro). Minha outra ideia brilhante foi usar arredondamento, que foi basicamente trocar seis por meia duzia. 

# Dia 3

Arrumei a parte da movimentação das peças e descobri que, se faço o tamanho do canvas pelo css e não pelo atributo do html, ele desaranja tudo (pois flexbox). Acabei fazendo um canvas de tamanho fixo no html que deixou layout feio, mas por outro lado facilitou a parte da lógica do jogo. Agora que só tenho que lidar com valores cheios e não proporções.

Outra coisa, imaginando que o jogo é um tabuleiro de x colunas por y linhas, uma hora ele vai precisar saber o que tem em cada uma das 'células' (imagine uma tabela excel), pra efeito de colisão ou algo nesse sentido. Então criei uma array 2D com todas as 'celulas' e pra cada celula um objeto que vai guardar informação sobre a ela (coordenadas, se ocupada ou não, etc). Assim o jogo pode acessar o que tem na celula usando simples coordenadas, do tipo tabuleiro[0][2]. 

