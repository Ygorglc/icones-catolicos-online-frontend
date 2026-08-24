# Testes do frontend

O projeto utiliza o executor de testes do Angular com Vitest e ambiente DOM simulado.

## Execução

```powershell
npm.cmd run test:ci
npm.cmd run test:coverage
```

## Cobertura funcional

- inicialização da aplicação e roteamento;
- catálogo público e conteúdo devocional;
- cadastro, login, sessão e logout;
- envio do JWT somente para a API do projeto;
- autorização das áreas de cliente e administrador;
- tratamento padronizado de erros e indicador de carregamento;
- persistência, totais e quantidades do carrinho;
- criação da encomenda e pagamentos simulados ou externos;
- pedidos, histórico financeiro e certificado do cliente;
- atualização de encomendas, análise de pagamentos e relatórios administrativos.

Para as evidências do TCC, registre a saída do comando, a quantidade de testes aprovados e, se utilizada, a pasta de cobertura gerada.

## Resultado registrado

Execução realizada em 24/08/2026:

- 13 arquivos de teste aprovados;
- 33 testes aprovados;
- 0 falhas e 0 erros não tratados;
- 83,64% de cobertura de instruções;
- 80,79% de cobertura de ramificações;
- 73,91% de cobertura de funções;
- 82,44% de cobertura de linhas.

As áreas de guards, interceptors, catálogo e checkout atingiram 100% de cobertura de linhas. O relatório HTML detalhado está disponível na pasta `coverage` após a execução do comando de cobertura.
