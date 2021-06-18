
function renderRemoteData(obj) {
   
    const endpoint = obj.url;

    const app = Vue.createApp({
        data() {
            return {
                allMembers: [], 
                checkboxes:{
                     d: true,
                     r: true,
                     id: true, 
                    },
                state:'All',
            }
        },
        created() {
            this.fetchData(endpoint)
        },
        methods: {
            fetchData(endpoint) {
                const init = {
                    method: 'GET',
                    headers: {
                        "X-API-Key": "c1VDlvVSCONXpNFqdmQQUzr0mwlE2MCeHuNUr52k"
                    }
                }

                fetch(endpoint, init)
                    .then(response => response.json())
                    .then(data => {
                        this.allMembers = data.results[0].members;
                        this.createStateFilter();
                    }).catch(error => console.log(error.message));
            },

            createStateFilter(){
            let stateList = document.querySelector('#state-select');
            let estados = [];
            this.allMembers.forEach(function (element) {
            if (!estados.includes(element.state)) {
                estados.push(element.state);
            }
            })
            estados.forEach((state) => {
                stateList.innerHTML += '<option>' + state + '</option>';
            })
            },
        },
        computed:{
            arrayCheckboxes() {
                let arrCheckboxes = Object.entries(this.checkboxes);
                return arrCheckboxes.map(arr => {if(arr[1]){return arr[0].toUpperCase()}});
            },
            filteredMembers(){
                if (this.state != 'All') {
                   return filteredMembers = this.allMembers.filter((element) => this.arrayCheckboxes.includes(element.party) && element.state == this.state);
                } else {
                   return filteredMembers = this.allMembers.filter((element) => this.arrayCheckboxes.includes(element.party));
                }
            },
        },
    })

    app.mount('#app');
}

