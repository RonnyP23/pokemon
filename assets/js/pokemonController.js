var app = angular.module('pokemon', []);

app.service('apiService', ['$http' ,function ($http){
    this.buscarLista = function (data,callback){
        var request = {
            method: 'GET',
            url:`https://pokeapi.co/api/v2/pokemon/?offset=${data.offset}&limit=${data.limit}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            } 
        }
        var response = $http (request);
        response.then(function(data) {
            callback({data:data})
        } )
        response.catch (function(data) {
            callback({msg: "erro"})
        })
        
    }

    this.navegaçao = function (data,callback){
        var request = {
            method: 'GET',
            url:`${data}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            } 
        }
        var response = $http (request);
        response.then(function(data) {
            callback({data:data})
        } )
        response.catch (function(data) {
            callback({msg: "erro"})
        })
    }
    this.buscar = function (data,callback){
        var request = {
            method: 'GET',
            url:`https://pokeapi.co/api/v2/pokemon/${data}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }
        var response = $http (request);
        response.then(function(data) {
            if(data.data == undefined){
                callback({ valido: false, msg: "erro" })
                return
            }
        /*   
            } */
            
            callback({valido: true, data:data})
        })
        response.catch (function(data) {
            callback({ msg: "erro"})
        })
        console.log(data)
        
    }
}])


app.controller('pokemonController', ['$scope','$http','apiService', function ($scope, $http, apiService){
    $scope.nome = "Ronny paulo";
    $scope.nomePokemon = '';
    $scope.totalLista = 0;
    $scope.paginaInicial = 1;
    $scope.paginFinal = 0;
    $scope.listaPokemon = []
    $scope.pokemons = [];

    $scope.dados = {
        offset: 0 ,
        limit: 20
    } 
    
   

    function atualizarTela() {
       
        apiService.buscarLista($scope.dados, function(dados) {
            $scope.pokemons = dados.data.data;
            $scope.listaPokemon = $scope.pokemons.results
            $scope.totalLista = $scope.pokemons.count
            
            $scope.paginaFinal = $scope.totalLista / $scope.dados.limit

        } ) 
        
    }
    atualizarTela();
    $scope.nav = function (e) {
        if(e == null){
            return
        }
        apiService.navegaçao(e, function(dados) {
            $scope.pokemons = dados.data.data;
            $scope.listaPokemon = $scope.pokemons.results
            $scope.totalLista = $scope.pokemons.count
            $scope.paginaFinal = $scope.totalLista / $scope.dados.limit
        })
    }

    $scope.buscar = function() {
        if( $scope.nomePokemon == '') {
            atualizarTela();
            return
        }
        apiService.buscar( $scope.nomePokemon, function(dados) {
           var retorno = {
                data:{
                    count: 1,
                    results: [
                        {
                            name: dados.data.data.species.name,
                            url: dados.data.data.species.url,
                            image: dados.data.data.sprites.front_default
                        }
                    ]
                }
            }
            $scope.pokemons = retorno.data;
            $scope.listaPokemon = $scope.pokemons.results
            $scope.totalLista = $scope.pokemons.count
            $scope.paginaFinal = $scope.totalLista / $scope.dados.limit
        })
    }

    $scope.paginacao = function(param) {
        if(param =='primeira') {
            $scope.dados = {
                offset: 0 ,
                limit: 20
            }
            $scope.paginaInicial = 1
           
            atualizarTela()
        }
        if(param =='anterior') {
            $scope.nav($scope.pokemons.previous);
            if($scope.pokemons.previous != null) {
                $scope.paginaInicial--
            }
        }
        if(param =='proxima') {
            $scope.nav($scope.pokemons.next);
            if($scope.pokemons.next != null) {
                $scope.paginaInicial++
            }
        }
        if(param =='ultima') {
            
            $scope.dados = {
                offset: $scope.totalLista - $scope.dados.limit ,
                limit: 20
            }
            $scope.paginaInicial = $scope.totalLista / $scope.dados.limit
            
            atualizarTela()
        }
       
    }
} ])

app.directive('ngEnter', function () {  
    return function (scope, element, attrs) {  
      element.bind("keydown keypress", function (event) {  
        if(event.which === 13) {  
          scope.$apply(function (){  
            scope.$eval(attrs.ngEnter);  
          });  
          event.preventDefault();  
        }  
      });  
    };  
});  

