/**
 * GovernanceContract represents basic information about a Governance contract deployed on the block chain.
 * @typedef {Object} GovernanceContract
 * @property {string} name Name of the controler
 * @property {string} address Address of the Governance contract
 * @property {number} totalProposals Total number of proposals managed by the Governance contract.
 * @property {[GovernanceProposal]} proposals List of proposals on the controler
 * @property {GovernanceProposal} proposal Proposal provides specific Governance Proposal detail identified by its ID inside the Governance contract.
 * @property {string} delegationsBy List of delegations for the given address.
 * @property {boolean} canVote Checks if the given address can submit votes to Proposals of this Governance conract.
 * @property {number} proposalFee The fee required by the Governance to accept proposals.
 */

/**
 * GovernanceProposal represents the details of a single proposal in the governance contract.
 * @typedef {Object} GovernanceProposal
 * @property {string} governanceId The identifier of the Governance contract this Proposal belongs to.
 * @property {string} name Name of the Proposal.
 * @property {string} description Textual description of the Proposal.
 * @property {ProposalState} state The state of the Proposal.
 * @property {string} contract The contract of the Proposal.
 * @property {number} proposalType Type of the Proposal that corresponds with the Proposal Template.
 * @property {boolean} isExecutable Identifies if the proposal will be finalized by executing a finializing code.
 * @property {number} minVotes Minimal number of votes required by the Proposal
 * @property {number} minAgreement Minimal agreement ratio required to be reached on any of the Proposal options
 * @property {[number]} opinionScales Scale of opinions on available options.
 * @property {[string]} options List of options available on the Proposal.
 * @property {number} votingStarts Time stamp of the voting getting opened to receive votes.
 * @property {number} votingMayEnd Time stamp when the voting could be closed if enough votes are collected to settle the Proposal (winner option is selectable).
 * @property {number} votingMustEnd Time stamp when the voting must be closed.
 * @property {[OptionState]} optionStates List of states of all the options in the Proposal.
 * @property {OptionState} optionState State of the selected option of the Proposal.
 * @property {GovernanceVote} vote Pulls the vote for the given <from> address linked with the <delegatedTo> delegation recipient.
 */

/**
 * ProposalState represents the state of the whole proposal.
 * @typedef {Object} ProposalState
 * @property {boolean} isResolved Signals if the Proposal is already resolved.
 * @property {number} winnerId Identifier of the winning option.
 * @property {number} votes Number of votes received on the Proposal.
 * @property {number} status Status of the Proposal.
 */

/**
 * OptionState represents a state in options of a Proposal.
 * @typedef {Object} OptionState
 * @property {number} optionId Identifier of the option, effectively option index in the options array
 * @property {number} votes Number of votes received on the option.
 * @property {number} agreementRatio Ratio of the option agreement across votes.
 * @property {number} agreement Absolute value of the agreement across votes.
 */

/**
 * GovernanceVote is the vote in the context of the given Governance Proposal.
 * @typedef {Object} GovernanceVote
 * @property {number} weight Represents the weight of the vote
 * @property {[number]} choices Represents the list of opinions on the Proposal options the vote presented.
 */
