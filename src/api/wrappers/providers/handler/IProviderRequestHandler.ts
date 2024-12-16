/**
 * Defining an interface called IProviderRequestHandler.
 * Must be implemented in all provider requests
 */
export default interface IProviderRequestHandler {
    /**
     * It returns request object
     * @param config - The request object that was sent to the server.
     * @returns The request object
     */
    handle(config: object): object;
}
