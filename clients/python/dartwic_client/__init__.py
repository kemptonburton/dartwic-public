#: Installed DARTWIC Python client version.
__version__ = "3.0.0"
#: Oldest DARTWIC engine version supported by this client.
MIN_ENGINE_VERSION = "2.1.0"

from .dartwic_client import DartwicClient

__all__ = ["DartwicClient", "__version__", "MIN_ENGINE_VERSION"]
