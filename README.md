# Podnews

<p align="center">
  <img src="http://icons.iconarchive.com/icons/diversity-avatars/avatars/128/robot-01-icon.png" width="100">
  <img src="https://cdn3.iconfinder.com/data/icons/wpzoom-developer-icon-set/500/49-512.png" width="100">
  <img src="https://cdn3.iconfinder.com/data/icons/ballicons-reloaded-free/512/icon-70-512.png" width="100">
</p>

Noticias diárias feitas por um(s) robô(s). O projeto foi inspirado tanto no projeto do [Podbot](https://github.com/lhcgoncalves/podbot) do Luiz Gonçalves, quanto no projeto [Video-Maker](https://github.com/filipedeschamps/video-maker) do Felipe Deschamps. O foco é criar um podcast de notícias diárias de forma automática.

# Contribuindo
- Crie uma branch assim `meu-nome/minha-funcionalidade`
- Trabalhe nela e de git pull ao finalizar

# Todo

- [ ] Geral
    - [x] Criar CLI
- [ ] RobotNews
    - [x] Pegar notícias pelo google news
    - [ ] Dar possibilidade de selecionar no terminal entre outros idiomas e categorias de notícias (tem na doc do google news)
    - [x] Separar sentenças
- [x] RobotCrawler
    - [x] Pegar notícias de outros sites através de um crawler
- [x] RobotFileManager
    - [x] Limpar pasta temporária
    - [x] Criar pasta temporária
    - [x] Responsavel pelo caminho da `/temp`
- [ ] RobotTextToSpeech
    - [x] Transformar texto em audio por sentença da notícia
    - [ ] Adicionar mais hosts
    - [ ] Modificar idioma dos hosts automaticamente dependendo do idioma das notícias
- [ ] RobotAudio
    - [ ] Criar introdução automaticamente
    - [ ] Criar transições para ficar mais agradavel e organizado
    - [x] Concatenar audio das notícias
- [ ] RobotImage
    - [ ] Conectar no google images
    - [ ] Procurar imagem por search
    - [ ] Adicionar texto na imagem
    - [ ] Criar capa do PodNews
- [ ] RobotShare
    - [ ] Compartilhar no twitter
    - [ ] Compartilhar no facebook
    - [ ] Compartilhar no soundclound
    - [ ] Link para baixar
    - [ ] QR Code para baixar
    - [ ] Criar um podcast automaticamente em certo horário do dia e compartilhar
