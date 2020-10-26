import './governance.types.js';
import gql from 'graphql-tag';
// import web3utils from 'web3-utils';
// import appConfig from '../../../app.config.js';

/** @type {Governance} */
export let governance = null;

/**
 * Plugin for various Governance requests and calculations.
 */
export class Governance {
    /**
     * @param {Vue} _Vue
     * @param {{apolloClient: ApolloClient}} _options
     */
    static install(_Vue, _options) {
        if (!governance) {
            governance = new Governance(_options);
            _Vue.prototype.$governance = governance;
        }
    }

    /**
     * @param {{apolloClient: ApolloClient}} _options
     */
    constructor(_options) {
        this.apolloClient = _options.apolloClient;
    }

    /**
     * @return {Promise<[GovernanceContract]|[]>}
     */
    async fetchContracts() {
        const data = await this.apolloClient.query({
            query: gql`
                query GovernanceContracts {
                    govContracts {
                        name
                        address
                        totalProposals
                    }
                }
            `,
            fetchPolicy: 'network-only',
        });

        return data.data.govContracts || [];
    }

    /**
     * @param {string} _govAddress Gov contract address
     * @param {string} _accountAddress
     * @param {string} _cursor
     * @param {number} [_count]
     * @return {Promise<GovernanceContract|{}>}
     */
    async fetchContractByAddress(_govAddress, _accountAddress, _cursor, _count = 20) {
        const data = await this.apolloClient.query({
            query: gql`
                query GovernanceContract($address: Address!, $from: Address, $cursor: Cursor, $count: Int!) {
                    govContract(address: $address) {
                        name
                        address
                        totalProposals
                        canVote(from: $from)
                        proposals(cursor: $cursor, count: $count) {
                            name
                            description
                            contract
                            minVotes
                            minAgreement
                            votingStarts
                            votingMayEnd
                            votingMustEnd
                        }
                    }
                }
            `,
            variables: {
                address: _govAddress,
                from: _accountAddress,
                cursor: _cursor,
                count: _count,
            },
            fetchPolicy: 'network-only',
        });

        return data.data.govContract || {};
    }

    /**
     * @param {string} _cursor
     * @param {number} [_count]
     * @return {Promise<Object>}
     */
    async fetchProposals(_cursor, _count = 20) {
        const data = await this.apolloClient.query({
            query: gql`
                query GovernanceProposals($cursor: Cursor, $count: Int!) {
                    govProposals(cursor: $cursor, count: $count) {
                        totalCount
                        pageInfo {
                            first
                            last
                            hasNext
                            hasPrevious
                        }
                        edges {
                            proposal {
                                name
                                description
                                contract
                                governanceId
                                minVotes
                                minAgreement
                                votingStarts
                                votingMayEnd
                                votingMustEnd
                            }
                            cursor
                        }
                    }
                }
            `,
            variables: {
                cursor: _cursor,
                count: _count,
            },
            fetchPolicy: 'network-only',
        });

        return data.data.govProposals || {};
    }

    /**
     * @param {string} _govAddress
     * @param {string} _accountAddress
     * @param {string} _proposalId
     * @return {Promise<Object>}
     */
    async fetchProposal(_govAddress, _accountAddress, _proposalId) {
        const data = await this.apolloClient.query({
            query: gql`
                query GovernanceContract($address: Address!, $from: Address, $id: BigInt!) {
                    govContract(address: $address) {
                        name
                        address
                        totalProposals
                        canVote(from: $from)
                        delegationsBy(from: $from)
                        proposal(id: $id) {
                            name
                            description
                            contract
                            state {
                                isResolved
                                status
                                winnerId
                            }
                            minVotes
                            minAgreement
                            votingStarts
                            votingMayEnd
                            votingMustEnd
                            vote(from: $from) {
                                weight
                                choices
                            }
                        }
                    }
                }
            `,
            variables: {
                address: _govAddress,
                from: _accountAddress,
                id: _proposalId,
            },
            fetchPolicy: 'network-only',
        });

        return data.data.govContract || {};
    }

    /**
     * @return {Promise<*>}
     */
    /*
    async fetchBlockchainState() {
        const data = await this.apolloClient.query({
            query: gql`
                query GetState {
                    state
                }
            `,
            fetchPolicy: 'network-only',
        });

        return data.state;
    }
    */
}
