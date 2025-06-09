namespace Middleware.API.Configurations
{
    public class TokenConfiguration(string secret, string issuer, string audience)
    {

        /// <summary>
        /// Issuer for token generation.
        /// </summary>
        public string Issuer { get; } = issuer;

        /// <summary>
        /// Secret for token generation.
        /// </summary>
        public string Secret { get; } = secret;
        public string Audience { get; } = audience;
    }
}
