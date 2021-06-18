
function averageVotes(arr) {
    if (arr.length == 0) {
        return 0;
    }
    let suma = 0;
    for (let element of arr) {
        suma += element.votes_with_party_pct;
    }
    return suma / arr.length;
}

// orden ascendente
const compareLoyalty = (a, b) => a.votes_with_party_pct - b.votes_with_party_pct;
const compareAttendance = (a, b) => a.missed_votes_pct - b.missed_votes_pct;
//  orden descendente
const compareLoyaltyDesc = (a, b) => b.votes_with_party_pct - a.votes_with_party_pct;
const compareAttendanceDesc = (a, b) => b.missed_votes_pct - a.missed_votes_pct;


// retorna un array de objetos
function getTenPercent(array, compareFunction) {
    let tenPercent = parseInt((array.length * 10) / 100);
    let aux = array.filter(member => member.total_votes != 0);
    aux.sort(compareFunction);
    return aux.slice(0, tenPercent);
}


function renderRemoteData(obj){
    const endpoint = obj.url;
    const app = Vue.createApp({
        data(){
            return{
                statistics : {
                    'general': {
                        'republican': {
                            'name': 'Republican',
                            'number': 0,
                            'voted_with_party_avg': 0,
                        },
                        'democrat': {
                            'name': 'Democrat',
                            'number': 0,
                            'voted_with_party_avg': 0,
                        },
                        'independent': {
                            'name': 'Independent',
                            'number': 0,
                            'voted_with_party_avg': 0,
                        },
                        'total': {
                            'name' : 'Total',
                            'number': 0,
                            'voted_with_party_avg': 0,
                        }
                    },
                    'most_loyal': 0,
                    'least_loyal': 0,
                    'most_engaged': 0,
                    'least_engaged': 0,
                },
            }
        },
        created(){  
            this.fetchData(endpoint);
        },
        methods:{
            fetchData(endpoint){
                const init = {
                    method : 'GET',
                    headers : {
                        "X-API-Key":"c1VDlvVSCONXpNFqdmQQUzr0mwlE2MCeHuNUr52k"
                      }
                }
                fetch(endpoint, init)
                .then(response => response.json())
                .then(data => {
                    this.getStatisticsData(data);
                })
                .catch(error => console.log(error.message))
            },
            getStatisticsData(data){
                let members = data.results[0].members;
                let republicans = members.filter(member => member.party == 'R');
                let democrats = members.filter(member => member.party == 'D');
                let independents = members.filter(member => member.party == 'ID');
            
                this.statistics.general.republican.number = republicans.length;
                this.statistics.general.democrat.number = democrats.length;
                this.statistics.general.independent.number = independents.length;
                this.statistics.general.total.number = members.length;
            
                this.statistics.general.republican.voted_with_party_avg = averageVotes(republicans);
                this.statistics.general.democrat.voted_with_party_avg = averageVotes(democrats);
                this.statistics.general.independent.voted_with_party_avg = averageVotes(independents);
                this.statistics.general.total.voted_with_party_avg = averageVotes(members);
            
                this.statistics.least_engaged =  getTenPercent(members, compareAttendanceDesc);
                this.statistics.most_engaged = getTenPercent(members, compareAttendance);
                this.statistics.most_loyal = getTenPercent(members, compareLoyaltyDesc)
                this.statistics.least_loyal = getTenPercent(members, compareLoyalty);
            }
            
        }
    })
    app.mount('#app');
}
