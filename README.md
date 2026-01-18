# 🌤️ Open Weather Front

Aplicação web para consulta de previsão do tempo desenvolvida em Angular, utilizando a API do OpenWeather.

## 📋 Sobre o Projeto

Aplicação que permite buscar informações climáticas de qualquer cidade do mundo através de um buscador com autocomplete. A interface exibe dados em tempo real como temperatura, umidade, pressão atmosférica, velocidade do vento e condições climáticas.

## 🛠️ Stack Tecnológica

- **Angular 21.1.0** - Framework principal
- **TypeScript 5.9.2** - Linguagem de programação
- **RxJS 7.8.0** - Programação reativa
- **Tailwind CSS 4.1.12** - Framework CSS utility-first
- **OpenWeather API** - Geocoding API e Current Weather Data API

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture**, organizando o código em camadas bem definidas.

### Como a Clean Architecture está sendo utilizada:

- **Core (Domínio)**: Contém as regras de negócio puras, independentes de frameworks e bibliotecas externas. As entidades, value objects, ports (interfaces) e use cases residem aqui.

- **Infra (Infraestrutura)**: Implementa os contratos definidos nos ports. Responsável por comunicação HTTP, mapeamento de DTOs da API para entidades do domínio e detalhes técnicos de integração.

- **Presentation (Apresentação)**: Camada de interface do usuário. Componentes, facades (gerenciamento de estado) e rotas. Depende do core, mas não conhece detalhes da infraestrutura.

- **Shared**: Utilitários e componentes genéricos compartilhados entre as camadas.

A dependência flui sempre em direção ao core: `presentation` → `core` ← `infra`, garantindo que as regras de negócio permaneçam isoladas e testáveis.
