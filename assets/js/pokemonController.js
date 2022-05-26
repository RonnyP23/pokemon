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

    this.buscar = function (data,callback){
        var request = {
            method: 'GET',
            url:`https://pokeapi.co/api/v2/pokemon/${data.nome}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }
        var response = $http (request);
        response.then(function(data) {
            if(data.data == undefined){
                callback({ isValid: false, msg: "erro" })
                return
            }
            res = {
                data:{
                    count: 1,
                    results: [
                        {
                            name: data.data.species.name,
                            url: data.data.species.url,
                            img: data.data.sprites.front_default
                        }
                    ]
                }
            }
            
            
        })
        response.catch (function(data) {
            callback({ msg: "erro"})
        })
        console.log(data)
        alert('buscar')
    }
}])

app.controller('pokemonController', ['$scope','$http','apiService', function ($scope, $http, apiService){
    $scope.nome = "Ronny paulo";
    $scope.buscar = '';
    $scope.totalLista = 0;
    $scope.paginaInicial = 0;
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
            $scope.paginaInicial = 1
            $scope.paginaFinal = $scope.totalLista / $scope.dados.limit
            console.log($scope.pokemons)
            console.log()

        } ) 
        
    }
    atualizarTela();

    $scope.paginacao = function() {

    }
} ])

