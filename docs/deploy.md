# Publicação automática — CyberOregon

Cada push para `main` executa o workflow **Deploy CyberOregon**. Também é possível
executá-lo em Actions → Deploy CyberOregon → Run workflow, selecionando `main`.
O workflow usa SSH para chamar um script fixo na VPS. O servidor busca o commit,
instala dependências, executa ESLint e compila como usuário `deploy` em uma pasta
separada. A versão ativa só muda depois de todas essas etapas passarem. Se a nova
versão não responder, a anterior é restaurada e o workflow falha.

## Secrets do repositório

Em Settings → Secrets and variables → Actions → Repository secrets:

| Nome | Valor |
| --- | --- |
| `VPS_HOST` | `187.41.103.39` |
| `VPS_USER` | `deploy` |
| `VPS_PORT` | `22` (opcional; padrão 22) |
| `VPS_SSH_KEY` | Chave privada sem senha correspondente a uma chave já autorizada para `deploy` na VPS |
| `VPS_KNOWN_HOSTS` | Entrada SSH confiável dessa VPS, obtida e verificada pelo console |

Secrets de outro repositório não são herdados. Se usar secrets da organização,
conceda acesso ao repositório `cyberoregon`. Nenhum secret de SMTP ou MongoDB
precisa ser enviado ao GitHub.

Para obter a entrada de host **dentro do console autenticado da VPS**:

```bash
awk '{print "187.41.103.39 " $1 " " $2}' /etc/ssh/ssh_host_ed25519_key.pub
```

## Instalação única na VPS

O script `scripts/deploy-cyberoregon.sh` deve ser instalado em
`/usr/local/bin/deploy-cyberoregon`, pertencente a `root:root`, modo `0755`.
Não execute diretamente uma cópia editável pelo usuário `deploy` com sudo.

O link `/srv/apps/cyberoregon-current` aponta inicialmente para
`/srv/apps/cyberoregon`. O override do serviço deve conter:

```ini
[Service]
WorkingDirectory=/srv/apps/cyberoregon-current
ExecStart=
ExecStart=/usr/bin/node /srv/apps/cyberoregon-current/node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3011
```

O `EnvironmentFile` continua em `/srv/apps/cyberoregon/.env.production`.
Cada release usa um link para esse mesmo arquivo. A instalação requer uma regra
sudo específica, validada com `visudo`:

```sudoers
deploy ALL=(root) NOPASSWD: /usr/local/bin/deploy-cyberoregon
```

Validação pelo console root:

```bash
/usr/local/bin/deploy-cyberoregon --check
```

## Uso diário

Faça commit e push das alterações para `main` pelo seu editor/Git GUI.
Confira a execução em https://github.com/rafashouman/cyberoregon/actions.
O push local continua sendo uma ação sua; a publicação na VPS é automática.

```bash
sudo systemctl status cyberoregon --no-pager
sudo journalctl -u cyberoregon -n 80 --no-pager
readlink -f /srv/apps/cyberoregon-current
```

Não edite o código dentro da release ativa. Edite o projeto local e publique
pelo GitHub. Continue editando as credenciais em
`/srv/apps/cyberoregon/.env.production`. Para variáveis de runtime, reinicie o
serviço; para `NEXT_PUBLIC_*`, execute novamente o deploy para recompilar.

O deploy faz um breve reinício do serviço. O MongoDB não é alterado. As releases
anteriores são mantidas no servidor; monitore o espaço em disco e remova apenas
releases antigas que não sejam a atual ou a usada para recuperação.
